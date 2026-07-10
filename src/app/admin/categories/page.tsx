import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryForm } from "@/components/admin/category-form";
import { getAdminCategories } from "@/actions/admin-categories";

export const metadata = { title: "Categories | Admin" };

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Categories</h1>

      <div className="mt-6 rounded-lg border border-border p-4">
        <CategoryForm />
      </div>

      {categories.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>{category._count.products}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
