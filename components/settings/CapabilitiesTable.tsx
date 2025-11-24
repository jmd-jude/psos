// components/settings/CapabilitiesTable.tsx

'use client';

import { useState } from 'react';
import { CompanyCapability } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Check, X } from 'lucide-react';

interface CapabilitiesTableProps {
  capabilities: CompanyCapability[];
}

interface EditState {
  [key: string]: {
    score: number;
    rationale: string;
  };
}

export default function CapabilitiesTable({ capabilities }: CapabilitiesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({});
  const [saving, setSaving] = useState(false);
  const [localCapabilities, setLocalCapabilities] = useState(capabilities);

  const startEditing = (capability: CompanyCapability) => {
    setEditingId(capability.id);
    setEditState({
      [capability.id]: {
        score: capability.score,
        rationale: capability.rationale || '',
      },
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditState({});
  };

  const saveCapability = async (id: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/capabilities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editState[id]),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update capability');
      }

      const updated = await response.json();

      // Update local state
      setLocalCapabilities((prev) =>
        prev.map((cap) => (cap.id === id ? updated : cap))
      );

      setEditingId(null);
      setEditState({});
    } catch (error) {
      console.error('Error updating capability:', error);
      alert('Failed to update capability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Capability</TableHead>
              <TableHead className="w-[120px]">Score (1-5)</TableHead>
              <TableHead>Rationale</TableHead>
              <TableHead className="w-[140px]">Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localCapabilities.map((capability) => {
              const isEditing = editingId === capability.id;
              const state = editState[capability.id];

              return (
                <TableRow key={capability.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{capability.name}</p>
                      {capability.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {capability.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={state.score.toString()}
                        onValueChange={(value) =>
                          setEditState({
                            ...editState,
                            [capability.id]: {
                              ...state,
                              score: parseInt(value),
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Initial</SelectItem>
                          <SelectItem value="2">2 - Developing</SelectItem>
                          <SelectItem value="3">3 - Defined</SelectItem>
                          <SelectItem value="4">4 - Managed</SelectItem>
                          <SelectItem value="5">5 - Optimizing</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          {capability.score}
                        </span>
                        <span className="text-muted-foreground text-sm">/5</span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Textarea
                        value={state.rationale}
                        onChange={(e) =>
                          setEditState({
                            ...editState,
                            [capability.id]: {
                              ...state,
                              rationale: e.target.value,
                            },
                          })
                        }
                        placeholder="Explain the score..."
                        className="min-h-[80px]"
                      />
                    ) : (
                      <p className="text-sm">
                        {capability.rationale || (
                          <span className="text-muted-foreground italic">
                            No rationale provided
                          </span>
                        )}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(capability.lastUpdated)}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveCapability(capability.id)}
                          disabled={saving}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={saving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(capability)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
