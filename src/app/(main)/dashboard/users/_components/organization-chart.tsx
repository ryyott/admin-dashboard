"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp, Search, Mail, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { organizationChart } from "@/data/users";
import { cn } from "@/lib/utils";
import { OrganizationNode } from "@/types/user";

export function OrganizationChart() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1"]));
  const [searchQuery, setSearchQuery] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const getChildren = (parentId: string): OrganizationNode[] => {
    return organizationChart.filter((node) => node.reportsTo === parentId);
  };

  const getRootNodes = (): OrganizationNode[] => {
    return organizationChart.filter((node) => !node.reportsTo);
  };

  const filteredChart = searchQuery
    ? organizationChart.filter(
        (node) =>
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.department.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : organizationChart;

  const renderNode = (node: OrganizationNode, level: number = 0) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    // If searching, only show nodes that match
    if (searchQuery && !filteredChart.find((n) => n.id === node.id)) {
      return null;
    }

    return (
      <div key={node.id} className="flex flex-col">
        <div className="flex items-start gap-4">
          {/* Connection Line */}
          {level > 0 && (
            <div className="flex flex-col items-center pt-6">
              <div className="bg-border h-6 w-px" />
              <div className="bg-border h-px w-8" />
            </div>
          )}

          {/* Node Card */}
          <Card className={cn("flex-1 transition-shadow hover:shadow-md", level === 0 && "border-primary")}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-1 gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={node.avatar} alt={node.name} />
                    <AvatarFallback>{getInitials(node.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold">{node.name}</h3>
                        <p className="text-muted-foreground text-sm">{node.position}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {node.department}
                        </Badge>
                      </div>
                      {hasChildren && (
                        <Button variant="ghost" size="sm" onClick={() => toggleNode(node.id)} className="h-8 w-8 p-0">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="max-w-[200px] truncate">{node.email}</span>
                      </div>
                      {node.teamSize !== undefined && node.teamSize > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{node.teamSize}</span>
                          <span>{node.teamSize === 1 ? "report" : "reports"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="border-border mt-4 ml-8 space-y-4 border-l-2 pl-8">
            {children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Organization Chart</h2>
            <p className="text-muted-foreground mt-1 text-sm">View your team structure and hierarchy</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (expandedNodes.size === organizationChart.length) {
                  setExpandedNodes(new Set(["1"]));
                } else {
                  setExpandedNodes(new Set(organizationChart.map((node) => node.id)));
                }
              }}
            >
              {expandedNodes.size === organizationChart.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search for an employee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-6">
        {searchQuery ? (
          // Show filtered results in a flat list
          <div className="space-y-4">
            {filteredChart.map((node) => (
              <Card key={node.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={node.avatar} alt={node.name} />
                      <AvatarFallback>{getInitials(node.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{node.name}</h3>
                      <p className="text-muted-foreground text-sm">{node.position}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {node.department}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        <span>{node.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Show hierarchical tree
          <div className="space-y-6">{getRootNodes().map((node) => renderNode(node))}</div>
        )}
      </div>

      {/* Zoom Controls - Optional */}
      <div className="bg-background fixed right-6 bottom-6 flex items-center gap-2 rounded-lg border p-2 shadow-lg">
        <Button variant="ghost" size="sm" className="h-8 px-3">
          Center view
        </Button>
        <div className="flex items-center gap-1 border-l pl-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            -
          </Button>
          <span className="min-w-[60px] text-center text-sm font-medium">120%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
