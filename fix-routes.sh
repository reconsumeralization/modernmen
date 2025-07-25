#!/bin/bash

echo "Fixing Next.js 15 dynamic route compatibility..."

# List of dynamic route files to fix
routes=(
  "app/api/admin/staff/[id]/route.ts"
  "app/api/admin/services/[id]/route.ts" 
  "app/api/admin/products/[id]/route.ts"
  "app/api/orders/[id]/route.ts"
  "app/api/clients/[id]/route.ts"
)

for route in "${routes[@]}"; do
  if [ -f "$route" ]; then
    echo "Fixing $route..."
    # Replace the function signature pattern
    sed -i 's/{ params }: { params: { id: string } }/context: { params: Promise<{ id: string }> }/g' "$route"
    # Replace params.id usage  
    sed -i 's/params\.id/id/g' "$route"
    # Add await context.params at the start of functions
    sed -i '/context: { params: Promise<{ id: string }> }/a\  const { id } = await context.params' "$route"
  fi
done

echo "Dynamic routes fixed for Next.js 15 compatibility!"