import { describe, it, expect, vi, beforeEach } from 'vitest';
import productsApi from '../productsApi';
import axiosClient from '../axiosClient';

// Mock axiosClient
vi.mock('../axiosClient', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: mockClient,
  };
});

describe('productsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll calls /products', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    (axiosClient.get as any).mockResolvedValue({ data: mockProducts });

    const result = await productsApi.getAll();

    expect(axiosClient.get).toHaveBeenCalledWith('/products');
    expect(result).toEqual(mockProducts);
  });

  it('getAll returns empty array if data is null', async () => {
    (axiosClient.get as any).mockResolvedValue({ data: null });

    const result = await productsApi.getAll();

    expect(axiosClient.get).toHaveBeenCalledWith('/products');
    expect(result).toEqual([]);
  });

  it('getById calls /products/:id', async () => {
    const mockProduct = { id: 1, name: 'Product 1' };
    (axiosClient.get as any).mockResolvedValue({ data: mockProduct });

    const result = await productsApi.getById(1);

    expect(axiosClient.get).toHaveBeenCalledWith('/products/1');
    expect(result).toEqual(mockProduct);
  });

  it('getById throws error if product not found', async () => {
    (axiosClient.get as any).mockResolvedValue({ data: null });

    await expect(productsApi.getById(1)).rejects.toThrow('Product not found');
  });

  it('create calls /products with POST', async () => {
    const payload = { name: 'New Product', price: 100 };
    const mockResponse = { id: 1, ...payload };
    (axiosClient.post as any).mockResolvedValue({ data: mockResponse });

    const result = await productsApi.create(payload as any);

    expect(axiosClient.post).toHaveBeenCalledWith('/products', payload);
    expect(result).toEqual(mockResponse);
  });

  it('update calls /products/:id with PUT', async () => {
    const payload = { name: 'Updated Product' };
    const mockResponse = { id: 1, ...payload };
    (axiosClient.put as any).mockResolvedValue({ data: mockResponse });

    const result = await productsApi.update(1, payload);

    expect(axiosClient.put).toHaveBeenCalledWith('/products/1', payload);
    expect(result).toEqual(mockResponse);
  });

  it('delete calls /products/:id with DELETE', async () => {
    (axiosClient.delete as any).mockResolvedValue({});

    await productsApi.delete(1);

    expect(axiosClient.delete).toHaveBeenCalledWith('/products/1');
  });
});
