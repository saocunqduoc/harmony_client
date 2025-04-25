import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Search } from "lucide-react";
import { BusinessSearchParams } from "../../api/services/businessService";

interface BusinessSearchProps {
  onSearch: (filters: BusinessSearchParams) => void;
  initialFilters?: BusinessSearchParams;
}

export function BusinessSearch({ onSearch, initialFilters }: BusinessSearchProps) {
  const form = useForm<BusinessSearchParams>({
    defaultValues: {
      name: initialFilters?.name || "",
      city: initialFilters?.city || "",
    },
  });

  const handleSubmit = (data: BusinessSearchParams) => {
    // Filter out empty string values
    const filters = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== "") {
        acc[key as keyof BusinessSearchParams] = value;
      }
      return acc;
    }, {} as BusinessSearchParams);
    
    onSearch(filters);
  };

  const handleReset = () => {
    form.reset({ name: "", city: "" });
    onSearch({});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Business name..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="City..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}