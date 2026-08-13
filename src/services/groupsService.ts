import { api } from ".";
import type { ICreateGroupDto, IGroup, IUpdateGroupDto } from "./interfaces";

export const groupsService = {
  async createGroup(data: ICreateGroupDto): Promise<IGroup> {
    const response = await api.post<IGroup>('/groups', data);
    return response.data;
  },

  async getGroupBySlug(slug: string): Promise<IGroup> {
    const response = await api.get<IGroup>(`/groups/${slug}`);
    return response.data;
  },

  async joinGroup(slug: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/groups/${slug}/join`);
    return response.data;
  },

  async leaveGroup(slug: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/groups/${slug}/leave`);
    return response.data;
  },

  async updateGroup(slug: string, data: IUpdateGroupDto): Promise<IGroup> {
    const response = await api.patch<IGroup>(`/groups/${slug}`, data);
    return response.data;
  },

  async getAllGroups(): Promise<IGroup[]> {
    const response = await api.get<IGroup[]>('/groups');
    return response.data;
  },

  async getMyGroups(): Promise<IGroup[]> {
    const response = await api.get<IGroup[]>('/groups/my');
    return response.data;
  },
};