import { Node } from 'liquor-tree'
import { LinkResource } from '@/types/resource'

/**
 * Helper function to transform into tree format
 * @param data
 */
export function treeTransform (data: LinkResource): Node<LinkResource> {
  const children = data.children

  return {
    text: data.title,
    children: children && children.map(treeTransform),
    data
  }
}
