import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminProducts } from "@/actions/admin-products";

export const metadata = { title: "Products | Admin" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Products</h1>
        <Link href="/admin/products/new" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="size-4" />
          New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No products yet. Create your first one.
        </p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>₹{Number(product.price).toLocaleString("en-IN")}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
