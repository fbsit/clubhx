
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Datos simulados de fuga
const exitPages = [
  { page: "/quotation-checkout", exits: 47 },
  { page: "/products/ChromaID", exits: 31 },
  { page: "/profile", exits: 12 }
];

export default function ExitPagesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zonas de Abandono</CardTitle>
        <p className="text-muted-foreground text-xs mt-1">
          Pasos/páginas donde más usuarios abandonan el proceso.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Página</TableHead>
              <TableHead>Abandonos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exitPages.map(row => (
              <TableRow key={row.page}>
                <TableCell>{row.page}</TableCell>
                <TableCell className="font-semibold text-destructive">{row.exits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
