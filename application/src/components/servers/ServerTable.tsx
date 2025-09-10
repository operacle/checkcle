import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  RefreshCw,
  Search,
  Eye,
  Activity,
  MoreHorizontal,
  Pause,
  Play,
  Edit,
  Trash2,
} from "lucide-react";
import { Server } from "@/types/server.types";
import { ServerStatusBadge } from "./ServerStatusBadge";
import { OSTypeIcon } from "./OSTypeIcon";
import { EditServerDialog } from "./EditServerDialog";
import { serverService } from "@/services/serverService";
import { useToast } from "@/hooks/use-toast";
import { pb } from "@/lib/pocketbase";
import { useTheme } from "@/contexts/ThemeContext";

interface ServerTableProps {
  servers: Server[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ServerTable = ({
  servers,
  isLoading,
  onRefresh,
}: ServerTableProps) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pausingServers, setPausingServers] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredServers = servers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (serverId: string) => {
    navigate(`/server-detail/${serverId}`);
  };

  const handleViewContainers = (serverId: string) => {
    navigate(`/container-monitoring/${serverId}`);
  };

  const handlePauseResume = async (server: Server) => {
    const serverId = server.id;
    const isPaused = server.status === "paused";

    if (pausingServers.has(serverId)) {
      return; // Already processing this server
    }

    try {
      setPausingServers((prev) => new Set(prev).add(serverId));

      // Only update the status field, preserving all other server configuration
      const updateData = {
        status: isPaused ? "up" : "paused",
        last_checked: new Date().toISOString(),
      };

      await pb.collection("servers").update(serverId, updateData);

      toast({
        title: isPaused ? "Server resumed" : "Server paused",
        description: `Monitoring ${isPaused ? "resumed" : "paused"} for ${
          server.name
        }`,
      });

      // console.log(`${isPaused ? 'Resume' : 'Pause'} server monitoring: ${serverId}`);

      // Refresh the server list to show updated status
      onRefresh();
    } catch (error) {
      // console.error('Error updating server status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          isPaused ? "resume" : "pause"
        } server monitoring. Please try again.`,
      });
    } finally {
      setPausingServers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(serverId);
        return newSet;
      });
    }
  };

  const handleEdit = (server: Server) => {
    setSelectedServer(server);
    setEditDialogOpen(true);
  };

  const handleDelete = (server: Server) => {
    setSelectedServer(server);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedServer || isDeleting) return;

    try {
      setIsDeleting(true);

      // Delete the server from the database
      await pb.collection("servers").delete(selectedServer.id);

      toast({
        title: "Server deleted",
        description: `${selectedServer.name} has been deleted successfully.`,
      });

      // Refresh the server list
      onRefresh();

      // Close the dialog
      setDeleteDialogOpen(false);
      setSelectedServer(null);
    } catch (error) {
      // console.error('Error deleting server:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete server. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const CustomProgressBar = ({
    value,
    label,
    subtitle,
    type,
  }: {
    value: number;
    label: string;
    subtitle: string;
    type: "cpu" | "memory" | "disk";
  }) => {
    const getGradientColors = (type: string, value: number) => {
      if (type === "cpu") {
        if (value > 90) return "from-red-500 to-red-600";
        if (value > 75) return "from-orange-500 to-orange-600";
        if (value > 60) return "from-yellow-500 to-yellow-600";
        return "from-green-500 to-green-600";
      }
      if (type === "memory") {
        if (value > 90) return "from-red-500 to-red-600";
        if (value > 75) return "from-yellow-500 to-yellow-600";
        return "from-blue-500 to-blue-600";
      }
      if (type === "disk") {
        if (value > 95) return "from-red-500 to-red-600";
        if (value > 85) return "from-yellow-500 to-yellow-600";
        return "from-orange-500 to-orange-600";
      }
      return "from-gray-500 to-gray-600";
    };

    const getTextColor = (value: number) => {
      if (value > 90) return "text-red-600 dark:text-red-400";
      if (value > 75) return "text-orange-600 dark:text-orange-400";
      if (value > 60) return "text-yellow-600 dark:text-yellow-400";
      return "text-green-600 dark:text-green-400";
    };

    return (
      <div className="space-y-2 min-w-[120px] -mt-20">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-semibold ${getTextColor(value)}`}>
            {label}
          </span>
          <span className="text-xs text-muted-foreground">{subtitle} </span>
        </div>
        <div className="relative">
          <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${getGradientColors(
                type,
                value
              )} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
              style={{ width: `${Math.min(value, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="flex-1 flex flex-col ">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Servers</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading servers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-4 px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Servers</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search servers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={onRefresh} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredServers.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">No servers found</p>
            </div>
          ) : (
            <div
              className={`${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } rounded-lg border border-border shadow-sm`}
            >
              <Table>
                <TableHeader
                  className={`${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <TableRow
                    className={`${
                      theme === "dark"
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      Name
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      Status
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      OS
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      IP Address
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      CPU
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      Memory
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      Disk
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      Uptime
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4`}
                    >
                      Last Checked
                    </TableHead>
                    <TableHead
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } font-medium text-base py-4 text-right`}
                    >
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.map((server) => {
                    const cpuUsage = server.cpu_usage || 0;
                    const memoryUsage =
                      server.ram_total > 0
                        ? (server.ram_used / server.ram_total) * 100
                        : 0;
                    const diskUsage =
                      server.disk_total > 0
                        ? (server.disk_used / server.disk_total) * 100
                        : 0;
                    const isPaused = server.status === "paused";
                    const isProcessing = pausingServers.has(server.id);

                    return (
                      <TableRow
                        key={server.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewDetails(server.id)}
                      >
                        <TableCell className="font-medium">
                          <div className="truncate" title={server.name}>
                            {server.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ServerStatusBadge status={server.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <OSTypeIcon osType={server.os_type} />
                            <span
                              className="text-sm truncate"
                              title={server.os_type}
                            >
                              {server.os_type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-1 py-0.5 rounded text-xs">
                            {server.ip_address}
                          </code>
                        </TableCell>
                        <TableCell>
                          <CustomProgressBar
                            value={cpuUsage}
                            label={`${cpuUsage.toFixed(1)}%`}
                            subtitle={`${server.cpu_cores} cores`}
                            type="cpu"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomProgressBar
                            value={memoryUsage}
                            label={`${memoryUsage.toFixed(1)}%`}
                            subtitle={serverService.formatBytes(
                              server.ram_total
                            )}
                            type="memory"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomProgressBar
                            value={diskUsage}
                            label={`${diskUsage.toFixed(1)}%`}
                            subtitle={serverService.formatBytes(
                              server.disk_total
                            )}
                            type="disk"
                          />
                        </TableCell>
                        <TableCell>
                          <div
                            className="text-sm truncate"
                            title={server.uptime}
                          >
                            {server.uptime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground text-xs">
                            {new Date(server.last_checked).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                disabled={isProcessing}
                              >
                                <span className="sr-only">Open menu</span>
                                {isProcessing ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[200px]"
                            >
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(server.id);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Server Detail
                              </DropdownMenuItem>
                              {server.docker === "true" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewContainers(server.id);
                                  }}
                                >
                                  <Activity className="mr-2 h-4 w-4" />
                                  Container Monitoring
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePauseResume(server);
                                }}
                                disabled={isProcessing}
                              >
                                {isPaused ? (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Resume Monitoring
                                  </>
                                ) : (
                                  <>
                                    <Pause className="mr-2 h-4 w-4" />
                                    Pause Monitoring
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(server);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Server
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(server);
                                }}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Server
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Server Dialog */}
      <EditServerDialog
        server={selectedServer}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onServerUpdated={onRefresh}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this server?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {selectedServer?.name}
              </span>{" "}
              and all of its monitoring data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
