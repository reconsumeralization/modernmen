'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Product {
  tags: any;
  inventory: any;
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  sku?: string;
  image?: string;
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  sku?: string;
  image?: string;
  inStock?: boolean;
  featured?: boolean;
}

export function useProducts() {
  const queryClient = useQueryClient();

  // Get all products
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  // Create product
  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // Update product
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // Get product by ID
  const getProductById = useCallback((id: string) => {
    return products.find((product: Product) => product.id === id);
  }, [products]);

  // Get active products
  const getActiveProducts = useCallback(() => {
    return products.filter((product: Product) => product.inStock);
  }, [products]);

  // Get featured products
  const getFeaturedProducts = useCallback(() => {
    return products.filter((product: Product) => product.featured && product.inStock);
  }, [products]);

  // Get products by category
  const getProductsByCategory = useCallback((category: string) => {
    return products.filter((product: Product) =>
      product.category?.toLowerCase() === category.toLowerCase()
    );
  }, [products]);

  // Get products by brand
  const getProductsByBrand = useCallback((brand: string) => {
    return products.filter((product: Product) =>
      product.brand?.toLowerCase() === brand.toLowerCase()
    );
  }, [products]);

  // Search products
  const searchProducts = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter((product: Product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.category?.toLowerCase().includes(lowercaseQuery) ||
      product.brand?.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [products]);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(products.map((product: Product) => product.category).filter(Boolean))];
    return categories.sort();
  }, [products]);

  // Get brands
  const getBrands = useCallback(() => {
    const brands = [...new Set(products.map((product: Product) => product.brand).filter(Boolean))];
    return brands.sort();
  }, [products]);

  // Get low stock products
  const getLowStockProducts = useCallback(() => {
    return products.filter((product: Product) => {
      if (!product.inventory?.trackInventory) return false;
      return product.inventory.quantity <= product.inventory.lowStockThreshold;
    });
  }, [products]);

  // Get out of stock products
  const getOutOfStockProducts = useCallback(() => {
    return products.filter((product: Product) => !product.inStock);
  }, [products]);

  // Get product statistics
  const getProductStats = useCallback(() => {
    const stats = {
      total: products.length,
      inStock: products.filter((p: Product) => p.inStock).length,
      outOfStock: products.filter((p: Product) => !p.inStock).length,
      featured: products.filter((p: Product) => p.featured).length,
      lowStock: products.filter((p: Product) => {
        if (!p.inventory?.trackInventory) return false;
        return p.inventory.quantity <= p.inventory.lowStockThreshold;
      }).length,
      totalValue: products.reduce((sum: number, product: Product) => sum + product.price, 0),
      averagePrice: products.length > 0 ? products.reduce((sum: number, product: Product) => sum + product.price, 0) / products.length : 0,
      byCategory: {} as Record<string, number>,
      byBrand: {} as Record<string, number>
    };
    products.forEach((product: Product) => {
      if (product.category) {
        stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
      }
      if (product.brand) {
        stats.byBrand[product.brand] = (stats.byBrand[product.brand] || 0) + 1;
      }
    });

    return stats;
  }, [products]);

  // Update product inventory
  const updateProductInventory = useCallback(async (
    productId: string,
    quantity: number,
    operation: 'set' | 'add' | 'subtract' = 'set'
  ) => {
    const product = getProductById(productId);
    if (!product) return false;

    let newQuantity = quantity;
    if (operation === 'add') {
      newQuantity = (product.inventory?.quantity || 0) + quantity;
    } else if (operation === 'subtract') {
      newQuantity = (product.inventory?.quantity || 0) - quantity;
    }

    try {
      await updateProductMutation.mutateAsync({
        id: productId,
        data: {
          inventory: {
            ...product.inventory,
            quantity: Math.max(0, newQuantity),
            trackInventory: product.inventory?.trackInventory || false,
            lowStockThreshold: product.inventory?.lowStockThreshold || 5
          }
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to update product inventory:', err);
      return false;
    }
  }, [getProductById, updateProductMutation]);

  return {
    products,
    isLoading,
    error,
    refetch,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    getProductById,
    getActiveProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getProductsByBrand,
    searchProducts,
    getCategories,
    getBrands,
    getLowStockProducts,
    getOutOfStockProducts,
    getProductStats,
    updateProductInventory
  };
}