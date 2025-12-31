"use client";

import { Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import type { Client } from "@/types/invoice";

interface ClientSelectorProps {
  value: string;
  onChange: (value: string) => void;
  clients: Client[];
  onAddClient: () => void;
}

export function ClientSelector({ value, onChange, clients, onAddClient }: ClientSelectorProps) {
  const selectedClient = clients.find((c) => c.id === value);

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select client">
            {selectedClient && (
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={selectedClient.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(selectedClient.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{selectedClient.name}</span>
                  <span className="text-muted-foreground text-xs">{selectedClient.email}</span>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(client.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{client.name}</span>
                  <span className="text-muted-foreground text-xs">{client.email}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" variant="outline" size="icon" onClick={onAddClient}>
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
