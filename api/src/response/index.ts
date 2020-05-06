import { Link } from '../entities/Link'

export const linkResourceRedirect = {
  doc: (link: Link): string => {
    return '/docs/' + link.value
  },
}
