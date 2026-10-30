-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'ENTREGADO');

-- AlterTable
ALTER TABLE "Zapato" ADD COLUMN     "tallas" INTEGER[];

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(12,2) NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoItem" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "zapatoId" INTEGER NOT NULL,
    "talla" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_zapatoId_fkey" FOREIGN KEY ("zapatoId") REFERENCES "Zapato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
