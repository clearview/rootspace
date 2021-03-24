import { Vue, Component } from 'vue-property-decorator'

// Fixed values now but in the future we will probably implement more dynamic roles
export const roleIdAdmin = 0
export const roleIdMember = 1

@Component
export default class RouteMixin extends Vue {
  hasRoleId (roleId: number): boolean {
    return this.$store.state.auth.user?.hasRoleId === roleId
  }

  get isAdmin (): boolean {
    return this.$store.state.auth.user?.hasRoleId === roleIdAdmin
  }

  get isMember (): boolean {
    return this.$store.state.auth.user?.hasRoleId === roleIdMember
  }
}
