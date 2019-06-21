const setPaddingBetweenNodes = ({
  context,
  problemNode,
  firstNode,
  message,
}) => {
  context.report({
    node: problemNode,
    message,
    fix: function(fixer) {
      return fixer.insertTextAfter(firstNode, '\n');
    },
  });
};

const getLeftSibling = node => {
  const siblings = node.parent.body;
  const nodePosition = siblings.indexOf(node);
  return siblings[nodePosition - 1];
};

const getStartLine = node => node && node.loc.start.line;

const getEndLine = node => node && node.loc.end.line;

const shouldFixGap = (bottomNode, topNode) =>
  getStartLine(topNode) - getEndLine(bottomNode) < 2;

export const padBefore = ({ context, node, beforeMessage }) => {
  const leftSibling = getLeftSibling(node);
  if (leftSibling && shouldFixGap(leftSibling, node)) {
    setPaddingBetweenNodes({
      context,
      problemNode: node,
      firstNode: leftSibling,
      message: beforeMessage,
    });
  }
};
