import { describe, it, expect, vi, beforeEach } from 'vitest';
import authApi from '../authApi';
import axiosClient, { axiosRefresh } from '../axiosClient';

// Mock axiosClient and axiosRefresh
vi.mock('../axiosClient', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return {
    default: mockClient,
    axiosRefresh: {
      post: vi.fn(),
    },
  };
});

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login calls /auth/token with correct payload', async () => {
    const payload = { username: 'test', password: 'password' };
    const mockResponse = { accessToken: 'token', refreshToken: 'refresh', user: { id: '1', name: 'Test' } };
    (axiosClient.post as any).mockResolvedValue({ data: mockResponse });

    const result = await authApi.login(payload);

    expect(axiosClient.post).toHaveBeenCalledWith('/auth/token', payload);
    expect(result).toEqual(mockResponse);
  });

  it('logout calls /auth/logout', async () => {
    (axiosClient.post as any).mockResolvedValue({});

    await authApi.logout();

    expect(axiosClient.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('getProfile calls /users/me', async () => {
    const mockProfile = { id: '1', name: 'Test' };
    (axiosClient.get as any).mockResolvedValue({ data: mockProfile });

    const result = await authApi.getProfile();

    expect(axiosClient.get).toHaveBeenCalledWith('/users/me');
    expect(result).toEqual(mockProfile);
  });

  it('updateProfile calls /users/me with PUT', async () => {
    const payload = { name: 'Updated' };
    const mockProfile = { id: '1', name: 'Updated' };
    (axiosClient.put as any).mockResolvedValue({ data: mockProfile });

    const result = await authApi.updateProfile(payload);

    expect(axiosClient.put).toHaveBeenCalledWith('/users/me', payload);
    expect(result).toEqual(mockProfile);
  });

  it('refreshToken calls /auth/refresh-token using axiosRefresh', async () => {
    const refreshToken = 'old_refresh_token';
    const mockResponse = { accessToken: 'new_token', refreshToken: 'new_refresh' };
    (axiosRefresh.post as any).mockResolvedValue({ data: mockResponse });

    const result = await authApi.refreshToken(refreshToken);

    expect(axiosRefresh.post).toHaveBeenCalledWith(
      '/auth/refresh-token',
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(result).toEqual(mockResponse);
  });
});
