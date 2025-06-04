import type { INode } from '@zhgu/data';
import type { EElementType } from '@zhgu/type';

/**
 * LCA算法:
 * 1.查找出共同父级
 * 2.将查找出的节点距离父级的深度进行排序处理
 * 得到lca父级节点、resultParents父级节点-1层级的节点关系
 */
export function findLCA(
  nodes: INode[],
  findTypeSet?: Set<EElementType>
): { lca: INode | null; resultParents: Map<string, INode> } {
  const ancestorMap = new Map();

  // Collect ancestors for each node
  nodes.forEach(node => {
    let current: INode | null = node;
    const ancestors = [];

    // Collect ancestors until reaching the root
    while (current) {
      // 如果findTypeSet存在，则进行type判断
      if (current.id !== node.id && (!findTypeSet || findTypeSet.has(current.type as EElementType))) {
        ancestors.push(current);
      }
      current = current.parent;
    }

    // Store the ancestors in reverse order (from root to node)
    ancestorMap.set(node.id, ancestors);
  });

  // Find the lowest common ancestor
  const firstNodeAncestors = ancestorMap.get(nodes[0].id);
  let lca: INode | null = null;
  const resultParents = new Map<string, INode>();

  // Check each ancestor of the first node
  for (let i = 0; i < firstNodeAncestors.length; i++) {
    const ancestor = firstNodeAncestors[i];
    let isCommonAncestor = true;
    resultParents.set(nodes[0].id, i >= 1 ? firstNodeAncestors[i - 1] : nodes[0]);

    // Check if the ancestor is common to all nodes
    for (let j = 1; j < nodes.length; j++) {
      const currentNodeAncestors = ancestorMap.get(nodes[j].id);
      const curIndex = currentNodeAncestors.indexOf(ancestor);
      if (currentNodeAncestors.indexOf(ancestor) === -1) {
        isCommonAncestor = false;
        resultParents.clear();
        break;
      } else {
        if (curIndex >= 1) {
          resultParents.set(nodes[j].id, currentNodeAncestors[curIndex - 1]);
        } else {
          resultParents.set(nodes[j].id, nodes[j]);
        }
      }
    }

    if (isCommonAncestor) {
      lca = ancestor;
      break; // Update lca if common ancestor found
    }
  }
  return { lca, resultParents };
}

/**
 * 传入选中的nodes，根据离共同父级的位置进行排序
 * @param {IBaseNode[]} nodes
 * @returns {{lca: IContainerNode | null, resultNodes: IBaseNode[]}}
 */
export function getSortFromLCA(nodes: INode[]): { lca: INode | null; resultNodes: INode[]; firstNode: INode } {
  const { lca, resultParents } = findLCA(nodes);
  if (lca) {
    nodes.sort((a, b) => {
      const aIndex = lca.children.indexOf(resultParents.get(a.id)!);
      const bIndex = lca.children.indexOf(resultParents.get(b.id)!);
      if (aIndex === bIndex && a.parent) {
        return a.parent.children.indexOf(a) - a.parent.children.indexOf(b);
      } else {
        return aIndex - bIndex;
      }
    });
    return { resultNodes: nodes, lca, firstNode: nodes[nodes.length - 1] };
  } else {
    return { resultNodes: nodes, lca, firstNode: nodes[nodes.length - 1] };
  }
}
