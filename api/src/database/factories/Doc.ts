import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { Doc } from '../../entities/Doc'

define(Doc, (faker: typeof Faker) => {
  const doc = new Doc()
  doc.userId = 1
  doc.spaceId = 1
  doc.title = faker.lorem.sentence()
  const content = {
    blocks: [
      {
        type: 'header',
        data: {
          text: 'Heading one',
          level: 2
        }
      },
      {
        type: 'paragraph',
        data: {
          text: faker.lorem.paragraph()
        }
      }
    ]
  }
  doc.content = content
  doc.access = 2
  return doc
})


