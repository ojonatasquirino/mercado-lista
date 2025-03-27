"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Plus, Trash, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("1");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("shoppingItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("shoppingItems", JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      newItemName.trim() === "" ||
      isNaN(Number(newItemPrice)) ||
      Number(newItemPrice) <= 0 ||
      isNaN(Number(newItemQuantity)) ||
      Number(newItemQuantity) <= 0
    ) {
      return;
    }

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      price: Number(newItemPrice),
      quantity: Number(newItemQuantity),
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemQuantity("1");
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearList = () => {
    setItems([]);
  };

  const startEditing = (item: ShoppingItem) => {
    setEditingItemId(item.id);
  };

  const updateItem = (id: string, updates: Partial<ShoppingItem>) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const finishEditing = () => {
    setEditingItemId(null);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container max-w-md mx-auto py-8 px-4 space-y-4">
      <Card className="bg-gray-800 border border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-center text-white">
            Lista de Compras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addItem} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name" className="text-white">
                  Item
                </Label>
                <Input
                  id="item-name"
                  type="text"
                  placeholder="Nome do item"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                  className="bg-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price" className="text-white">
                  Preço
                </Label>
                <Input
                  id="item-price"
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  required
                  className="bg-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-quantity" className="text-white">
                  Qtd
                </Label>
                <Input
                  id="item-quantity"
                  type="number"
                  placeholder="1"
                  min="1"
                  step="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  required
                  className="bg-gray-700 text-white"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </form>

          {items.length > 0 ? (
            <div className="space-y-4">
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 border border-gray-700 rounded-md bg-gray-800"
                  >
                    {editingItemId === item.id ? (
                      <div className="flex flex-col space-y-2">
                        <div className="font-medium text-white">
                          {item.name}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label
                              htmlFor={`price-${item.id}`}
                              className="text-xs text-white"
                            >
                              Preço
                            </Label>
                            <Input
                              id={`price-${item.id}`}
                              value={item.price}
                              type="number"
                              min="0.01"
                              step="0.01"
                              onChange={(e) =>
                                updateItem(item.id, {
                                  price: Number(e.target.value),
                                })
                              }
                              className="bg-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor={`quantity-${item.id}`}
                              className="text-xs text-white"
                            >
                              Quantidade
                            </Label>
                            <Input
                              id={`quantity-${item.id}`}
                              value={item.quantity}
                              type="number"
                              min="1"
                              step="1"
                              onChange={(e) =>
                                updateItem(item.id, {
                                  quantity: Number(e.target.value),
                                })
                              }
                              className="bg-gray-700 text-white"
                            />
                          </div>
                          <div className="flex items-end justify-end">
                            <Button
                              size="sm"
                              onClick={finishEditing}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Concluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-400">
                            R$ {item.price.toFixed(2)} × {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(item)}
                            className="h-8 w-8 bg-gray-600 hover:bg-gray-700"
                          >
                            <Pencil className="h-4 w-4 text-white" />
                            <span className="sr-only">Editar {item.name}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-red-600"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remover {item.name}</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <Separator className="border-gray-700" />

              <div className="flex items-center justify-between font-bold text-white">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              Sua lista está vazia. Adicione alguns itens!
            </div>
          )}
        </CardContent>
        {items.length > 0 && (
          <CardFooter className="bg-gray-800">
            <Button
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={clearList}
            >
              <Trash className="h-4 w-4 mr-2" />
              Limpar Lista
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
