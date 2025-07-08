import { ICustomEvent } from '@/designable/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class UpdateNodeConfigPropsEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'update:node:configProps'
}
