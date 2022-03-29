import { prisma } from "~/db.server";

export function getNotecard({ userId, id }: { userId: string; id: string }) {
    return prisma.notecard.findFirst({
        where: { id, userId },
    });
}

export function getNotecardListItems({ userId }: { userId: string }) {
    return prisma.notecard.findMany({
        where: { userId: userId },
        select: { id: true, sideOne: true, sideTwo: true },
        orderBy: { updatedAt: "desc" },
    });
}

export function createNotecard({
    sideOne,
    sideTwo,
    userId,
}: {
    sideOne: string;
    sideTwo: string;
    userId: string;
}) {
    return prisma.notecard.create({
        data: {
            sideOne,
            sideTwo,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}

export function deleteNotecard({ id, userId }: { id: string; userId: string }) {
    return prisma.notecard.deleteMany({
        where: { id, userId },
    });
}

export type { Notecard } from "@prisma/client";
