import { Node } from 'liquor-tree'
import { LinkResource } from '@/types/resource'

/**
 * Helper function to transform into tree format
 * @param data
 */
export function treeTransform (data: LinkResource): Node<LinkResource> {
  const children = data.children

  return {
    id: data.id,
    text: data.title,
    children: children.map(treeTransform),
    isBatch: false,
    isEditing: false,
    parent: null,
    states: {},
    data
  }
}
