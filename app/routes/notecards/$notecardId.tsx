import type { LoaderFunction, ActionFunction } from "remix";
import { redirect } from "remix";
import { json, useLoaderData, useCatch, Form } from "remix";
import invariant from "tiny-invariant";
import type { Notecard } from "~/models/notecard.server";
import { deleteNotecard } from "~/models/notecard.server";
import { getNotecard } from "~/models/notecard.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
    notecard: Notecard;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);
    invariant(params.notecardId, "noteId not found");

    const notecard = await getNotecard({ userId, id: params.notecardId });
    if (!notecard) {
        throw new Response("Not Found", { status: 404 });
    }
    return json<LoaderData>({ notecard });
};

export const action: ActionFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);
    invariant(params.notecardId, "notecardId not found");

    await deleteNotecard({ userId, id: params.notecardId });

    return redirect("/notecards");
};

export default function NotecardDetailsPage() {
    const data = useLoaderData() as LoaderData;

    return (
        <div>
            <h3 className="text-2xl font-bold">{data.notecard.sideOne}</h3>
            <p className="py-6">{data.notecard.sideTwo}</p>
            <hr className="my-4" />
            <Form method="post">
                <button
                    type="submit"
                    className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                    Delete
                </button>
            </Form>
        </div>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 404) {
        return <div>Note not found</div>;
    }

    throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
