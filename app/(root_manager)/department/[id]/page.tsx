"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useCompany } from "@/components/providers/CompanyProvider";
import { DataTable } from "@/components/ui/DataTable";
import { createColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { useManualQuery, useMutation } from "graphql-hooks";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Toaster, toast } from "sonner"; // Add Toaster component import

interface DepartmentStats {
  members: number;
  leads: number;
  newLeads: number;
  inProgress: number;
  completed: number;
}

export default function DepartmentPage() {
  const params = useParams();
  const { departments } = useCompany();
  const [stats, setStats] = useState<DepartmentStats>({
    members: 0,
    leads: 0,
    newLeads: 0,
    inProgress: 0,
    completed: 0,
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });
  const [dateRange, setDateRange] = useState<{
    fromDate: Date | null;
    toDate: Date | null;
  }>({
    fromDate: null,
    toDate: null,
  });

  const [getLeads] = useManualQuery(leadQueries.GET_DEPARTMENT_LEADS, {
    onSuccess: ({ data }) => {
      setStats(data.getLeadsByDeptId?.stats || {
        members: 0,
        leads: 0,
        newLeads: 0,
        inProgress: 0,
        completed: 0,
      });
      setLeads(data.getLeadsByDeptId?.leads || []);
      setPagination(data.getLeadsByDeptId?.pagination || undefined);
      setLoading(false);
    },
    // on: (error) => {
    //   console.error("Error fetching leads:", error);
    //   setLoading(false);
    // },
  });

  const [deleteLead, { loading: deleteLoading }] = useMutation(leadQueries.DELETE_LEAD);

  const handleDeleteLead = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await deleteLead({
        variables: {
          id
        }
      });

      if (error) {
        toast.error("Failed to delete lead");
        console.error("Error deleting lead:", error);
        setLoading(false);
        return;
      }

      if (data?.deleteLead?.name) {
        toast.success("Lead deleted successfully");
        // Refresh the leads list
        fetchLeads();
      } else {
        toast.error("Failed to delete lead");
        setLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the lead");
      console.error("Error in delete lead handler:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async (pageNumber?: number) => {
    setLoading(true);
    await getLeads({
      variables: {
        deptId: params.id,
        page: pageNumber || page,
        limit,
        fromDate: dateRange.fromDate ? format(dateRange.fromDate, "yyyy-MM-dd") : null,
        toDate: dateRange.toDate ? format(dateRange.toDate, "yyyy-MM-dd") : null,
        searchQuery: searchQuery || null,
      },
    });
  };

  const handleSearch = () => {
    setPage(1);
    fetchLeads();
  };

  const handleDateChange = (type: "fromDate" | "toDate", date: Date | null) => {
    setDateRange((prev) => ({ ...prev, [type]: date }));
  };

  const handlePageChange = (newPage: number) => {
    // Only update and fetch if the page actually changed
    if (newPage !== pagination.page) {
      setPage(newPage);
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
      fetchLeads(newPage);
    }
  };

  const department = departments?.find((dept: any) => dept.id === params.id);

  const cards = [
    { title: "Members", value: stats.members },
    { title: "Leads", value: stats.leads },
    { title: "New Leads", value: stats.newLeads },
    { title: "In Progress", value: stats.inProgress },
    { title: "Completed", value: stats.completed },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{department?.name || "Department"}</h1>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">{card.title}</div>
              <div className="text-2xl font-bold mt-1">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex gap-4 mb-4">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(
                "justify-start text-left font-normal",
                !dateRange.fromDate && "text-muted-foreground"
              )}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.fromDate ? format(dateRange.fromDate, "PPP") : "From Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.fromDate || undefined}
                onSelect={(day: Date | undefined) => handleDateChange("fromDate", day || null)}
                initialFocus
                disabled={{ after: new Date() }}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(
                "justify-start text-left font-normal",
                !dateRange.toDate && "text-muted-foreground"
              )}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.toDate ? format(dateRange.toDate, "PPP") : "To Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.toDate || undefined}
                onSelect={(day: Date | undefined) => handleDateChange("toDate", day || null)}
                initialFocus
                disabled={{ after: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={createColumns(handleDeleteLead)}
          data={leads || []}
          pagination={{
            page: pagination.page,
            pageSize: pagination.limit,
            onPageChange: handlePageChange,
            total: pagination.total
          }}
        />
      </div>
    </div>
  );
}
