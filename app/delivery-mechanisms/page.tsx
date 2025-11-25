// app/delivery-mechanisms/page.tsx
import React from 'react';
import { getDeliveryMechanisms } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function DeliveryMechanismsPage() {
  const mechanisms = await getDeliveryMechanisms();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Delivery Mechanisms</h1>
        <p className="text-sm text-muted-foreground">
          Manage product delivery mechanisms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Delivery Mechanisms ({mechanisms.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Sort Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mechanisms.map((mechanism) => (
                <TableRow key={mechanism.id}>
                  <TableCell className="font-medium">{mechanism.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {mechanism.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm">{mechanism.sortOrder}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
