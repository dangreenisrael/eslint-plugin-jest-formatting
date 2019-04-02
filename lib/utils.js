const setPaddingBetweenNodes = ({
  context,
  problemNode,
  firstNode,
  secondNode,
  message
}) => {
  context.report({
    node: problemNode,
    message,
    fix: function(fixer) {
      return [
        fixer.removeRange([
          firstNode.end,
          secondNode.start - secondNode.loc.start.column
        ]),
        fixer.insertTextAfter(firstNode, "\n\n")
      ];
    }
  });
};

const getLeftSibling = node => {
  const siblings = node.parent.body;
  return siblings.find(s => s.end === node.start - 1);
};

const getRightSibling = node => {
  const siblings = node.parent.body;
  return siblings.find(s => s.start === node.end + 1);
};

const getStartLine = node => node && node.loc.start.line;

const getEndLine = node => node && node.loc.start.line;

const shouldFixGap = (bottomNode, topNode) =>
  getStartLine(topNode) - getEndLine(bottomNode) !== 2;

const padBefore = (context, node, qualifier, beforeMessage) => {
  const leftSibling = getLeftSibling(node);
  if (
    leftSibling &&
    !qualifier(leftSibling) &&
    shouldFixGap(leftSibling, node)
  ) {
    setPaddingBetweenNodes({
      context,
      problemNode: node,
      firstNode: leftSibling,
      secondNode: node,
      message: beforeMessage
    });
  }
};

const padAfter = (context, node, afterMessage) => {
  const rightSibling = getRightSibling(node);
  if (rightSibling && shouldFixGap(node, rightSibling)) {
    setPaddingBetweenNodes({
      context,
      problemNode: node,
      firstNode: node,
      secondNode: rightSibling,
      message: afterMessage
    });
  }
};

const padBothSides = (
  context,
  node,
  qualifier,
  beforeMessage,
  afterMessage
) => {
  padBefore(context, node, qualifier, beforeMessage);
  padAfter(context, node, afterMessage);
};

module.exports = {
  padBothSides
};
