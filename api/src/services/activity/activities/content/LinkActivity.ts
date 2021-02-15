import { Link } from '../../../../database/entities/Link'
import { ContentActivity } from './ContentActivity'
import { push, persist, handler } from '../activityProperties'
import { entityAttributes, entityUpdateAttributes } from '../entityAttributes'

@push()
@persist()
@handler('TaskActivityHandler')
@entityAttributes(['id', 'title', 'value'])
@entityUpdateAttributes(['title', 'value'])
export class LinkActivity extends ContentActivity<Link> {
  

  getEntityName(): string {
    return 'Link'
  }
}
