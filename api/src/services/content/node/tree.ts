import { Node } from '../../../database/entities/Node'

export const buildTree = (nodes: Node[], root: Node): Node[] => {
  const tree = []

  for (const node of nodes) {
    if (node.parentId === root.id) {
      tree.push(node)
    }
  }

  for (const node of tree) {
    node.children = buildChildrenTree(node, nodes)
  }

  return sortTree(tree)
}

export const buildChildrenTree = (parent: Node, nodes: Node[]) => {
  const children = []

  for (const node of nodes) {
    if (node.parentId === parent.id) {
      node.children = buildChildrenTree(node, nodes)
      children.push(node)
    }
  }

  return children
}

export const sortTree = (nodes: Node[]): Node[] => {
  const sorted = nodes.sort((node1, node2) => {
    if (node1.position > node2.position) {
      return 1
    }

    if (node1.position < node2.position) {
      return -1
    }

    return 0
  })

  sorted.map((node) => {
    if (!node.children || node.children.length === 0) {
      return node
    }

    return (node.children = sortTree(node.children))
  })

  return sorted
}

const findInTree = (nodes: Node[], findId: number): Node | null => {
  for (const node of nodes) {
    if (node.id === findId) {
      return node
    }

    if (node.children && node.children.length > 0) {
      const result = findInTree(node.children, findId)

      if (result) {
        return result
      }
    }
  }

  return null
}

const filterDescendants = (parent: Node, nodes: Node[]) => {
  const descendants = []

  for (const node of nodes) {
    if (parent.id === node.parentId) {
      descendants.push(node)
      descendants.push(...filterDescendants(node, nodes))
    }
  }

  return descendants
}
