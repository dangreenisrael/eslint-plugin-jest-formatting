/**
 * Every rule must describe itself: stable metadata, shared message ids, and a
 * doc file with a fixed shape whose examples are real. These checks keep
 * `src/index.ts`, `docs/rules`, README.md, AGENTS.md and llms.txt in step.
 */

/* eslint-disable @typescript-eslint/no-var-requires -- CommonJS test file */

const fs = require('fs');
const path = require('path');
const { Linter } = require('eslint');
const plugin = require('../lib');
const { messages, DOCS_BASE_URL } = require('../lib/rules/padding');
const packageJson = require('../package.json');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs', 'rules');
const readRoot = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const ruleNames = Object.keys(plugin.rules);
const MESSAGE_IDS = ['missingPaddingBefore', 'missingPaddingAfter'];
const SECTIONS = [
  'Rule summary',
  'Why',
  'Incorrect examples',
  'Correct examples',
  'Options',
  'Fixability',
];

// Lint a doc example with one rule enabled, the way the docs show it.
const lint = (ruleName, code) => {
  const linter = new Linter({ configType: 'flat' });
  const config = [
    {
      plugins: { 'jest-formatting': plugin },
      rules: { [`jest-formatting/${ruleName}`]: 'error' },
    },
  ];
  const options = { filename: 'example.test.js' };
  const report = linter.verify(code, config, options);

  expect(report.filter((m) => m.fatal)).toEqual([]);

  return { report, output: linter.verifyAndFix(code, config, options).output };
};

// The "ESLint reports:" blocks in the docs use this layout.
const formatReport = (ruleName, report) =>
  report
    .map(
      (m) =>
        `${m.line}:${m.column}  error  ${m.message}  jest-formatting/${ruleName}`,
    )
    .join('\n');

const fences = (text, lang) => {
  const re = new RegExp(`\`\`\`${lang}\\n([\\s\\S]*?)\\n\`\`\``, 'g');
  const out = [];
  let match = re.exec(text);

  while (match) {
    out.push(match[1]);
    match = re.exec(text);
  }

  return out;
};

const section = (md, name) => {
  const start = md.indexOf(`\n## ${name}\n`);
  const next = md.indexOf('\n## ', start + 1);

  return md.slice(start, next < 0 ? md.length : next);
};

describe('plugin', () => {
  it('exposes its name and version from package.json', () => {
    expect(plugin.meta).toEqual({
      name: packageJson.name,
      version: packageJson.version,
    });
  });

  it('exposes the four presets', () => {
    expect(Object.keys(plugin.configs)).toEqual([
      'recommended',
      'strict',
      'flat/recommended',
      'flat/strict',
    ]);
  });

  describe.each(['recommended', 'strict'])('%s preset', (preset) => {
    const legacy = plugin.configs[preset];
    const flat = plugin.configs[`flat/${preset}`];

    it('enables only rules that exist, under the plugin prefix', () => {
      const enabled = Object.keys(legacy.overrides[0].rules);

      expect(enabled.length).toBeGreaterThan(0);
      enabled.forEach((fullName) => {
        expect(fullName).toMatch(/^jest-formatting\//);
        expect(ruleNames).toContain(fullName.replace('jest-formatting/', ''));
      });
    });

    it('enables the same rules in flat and legacy form', () => {
      expect(flat.rules).toEqual(legacy.overrides[0].rules);
      expect(legacy.plugins).toEqual(['jest-formatting']);
      expect(flat.plugins['jest-formatting']).toBe(plugin);
    });
  });

  it('keeps padding-around-expect-groups out of recommended', () => {
    expect(plugin.configs.recommended.overrides[0].rules).not.toHaveProperty(
      'jest-formatting/padding-around-expect-groups',
    );
    expect(plugin.configs.strict.overrides[0].rules).toEqual({
      'jest-formatting/padding-around-all': 2,
    });
  });
});

describe('shared messages', () => {
  it.each(MESSAGE_IDS)('%s names the token and the fix', (id) => {
    expect(messages[id]).toMatch(
      /^Missing blank line (before|after) `\{\{token\}\}`\./,
    );
    expect(messages[id]).toContain('Fix:');
    expect(messages[id]).toContain('(autofixable with --fix)');
  });
});

describe.each(ruleNames)('%s', (name) => {
  const rule = plugin.rules[name];
  const docFile = path.join(DOCS, `${name}.md`);

  describe('meta', () => {
    it('is a fixable layout rule with no options', () => {
      expect(rule.meta.type).toBe('layout');
      expect(rule.meta.fixable).toBe('whitespace');
      expect(rule.meta.schema).toEqual([]);
      expect(rule.meta.deprecated).toBe(false);
    });

    it('has a description and a docs url that points at its doc file', () => {
      expect(typeof rule.meta.docs.description).toBe('string');
      expect(rule.meta.docs.description.length).toBeGreaterThan(10);
      expect(rule.meta.docs.url).toBe(`${DOCS_BASE_URL}/${name}.md`);
      expect(fs.existsSync(docFile)).toBe(true);
    });

    it('uses the two shared message ids', () => {
      expect(rule.meta.messages).toBe(messages);
      expect(Object.keys(rule.meta.messages)).toEqual(MESSAGE_IDS);
    });
  });

  describe('doc', () => {
    const md = fs.readFileSync(docFile, 'utf8');

    it('starts with the rule name and its facts', () => {
      expect(md.startsWith(`# ${name}\n`)).toBe(true);
      expect(md).toContain(`- **Rule ID:** \`jest-formatting/${name}\``);
      expect(md).toContain('- **Presets:**');
      expect(md).toContain('- **Fixable:** yes');
      expect(md).toContain('- **Options:** none');
      expect(md).toContain(
        `- **Message IDs:** \`${MESSAGE_IDS[0]}\`, \`${MESSAGE_IDS[1]}\``,
      );
    });

    it('has the six sections in order and no others', () => {
      const headings = md.match(/^## .*$/gm).map((h) => h.slice(3));

      expect(headings).toEqual(SECTIONS);
    });

    it('quotes both messages verbatim', () => {
      const fixability = section(md, 'Fixability');

      MESSAGE_IDS.forEach((id) => {
        expect(fixability).toContain(`\`${id}\``);
        expect(fixability).toContain(messages[id]);
      });
    });

    it('enables the rule in the options snippet', () => {
      expect(section(md, 'Options')).toContain(
        `'jest-formatting/${name}': 'error'`,
      );
    });

    describe('examples', () => {
      const incorrect = fences(section(md, 'Incorrect examples'), 'js');
      const reports = fences(section(md, 'Incorrect examples'), 'text');
      const correct = fences(section(md, 'Correct examples'), 'js');

      it('has at least one incorrect example, each with a report block', () => {
        expect(incorrect.length).toBeGreaterThan(0);
        expect(reports).toHaveLength(incorrect.length);
        expect(correct.length).toBeGreaterThanOrEqual(incorrect.length);
      });

      it.each(incorrect.map((code, i) => [i, code]))(
        'incorrect example %i is reported exactly as documented',
        (i, code) => {
          const { report } = lint(name, code);

          expect(report.length).toBeGreaterThan(0);
          expect(formatReport(name, report)).toBe(reports[i]);
        },
      );

      it.each(incorrect.map((code, i) => [i, code]))(
        'fixing incorrect example %i yields correct example %i',
        (i, code) => {
          expect(lint(name, code).output).toBe(correct[i]);
        },
      );

      it.each(correct.map((code, i) => [i, code]))(
        'correct example %i is not reported',
        (i, code) => {
          expect(lint(name, code).report).toEqual([]);
        },
      );
    });
  });
});

describe('docs/rules', () => {
  it('has one file per rule and nothing else', () => {
    expect(fs.readdirSync(DOCS).sort()).toEqual(
      ruleNames.map((name) => `${name}.md`).sort(),
    );
  });
});

describe.each([
  ['README.md', (name) => `[${name}](docs/rules/${name}.md)`],
  ['AGENTS.md', (name) => `\`${name}\``],
  [
    'llms.txt',
    (name) =>
      `[${name}](https://raw.githubusercontent.com/dangreenisrael/eslint-plugin-jest-formatting/master/docs/rules/${name}.md)`,
  ],
])('%s', (file, entry) => {
  const text = readRoot(file);

  it.each(ruleNames)('lists %s', (name) => {
    expect(text).toContain(entry(name));
  });
});
