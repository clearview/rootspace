import * as faker from 'faker'
import {User} from '../../src/entities/User'
import {Space} from '../../src/entities/Space'
import {SpaceCreateValue} from '../../src/values/space'
import {SpaceFacade} from '../../src/services/facade'

async function createSpace(user: User, title?: string): Promise<Space> {
    const spaceCreateValue = new SpaceCreateValue(user.id, title ? title : faker.company.companyName())
    const spaceFacade = new SpaceFacade()

    return spaceFacade.createSpace(spaceCreateValue)
}

export { createSpace }