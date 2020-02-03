import * as Factory from 'factory.ts';
import { IPermission, IPermissionDocument, IUserGroup } from 'modules/settings/permissions/types';
import { userFactory } from '../auth';

export const userGroupFactory = Factory.Sync.makeFactory<IUserGroup>({
  _id: '1',
  name: 'nmma',
  description: 'company',
  memberIds: ['1'],
  members: [
    userFactory.build(),
    userFactory.build({ _id: '3' }),
  ]
});

export const permissionDocumentFactory = Factory.Sync.makeFactory<IPermissionDocument>({
  _id: '1',
  user: userFactory.build(),
  group: userGroupFactory.build(),
  module: 'module',
  action: 'edit',
  userId: '1',
  groupId: '1',
  requiredActions: [''],
  allowed: false
});

export const permissionFactory = Factory.Sync.makeFactory<IPermission>({
  module: 'module',
  action: 'edit',
  userId: '1',
  groupId: '1',
  requiredActions: [''],
  allowed: false
});