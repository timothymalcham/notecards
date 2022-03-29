import { Form, json, useLoaderData, Outlet, Link, NavLink } from "remix";
import type { LoaderFunction } from "remix";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNotecardListItems } from "~/models/notecard.server";

type LoaderData = {
    notecardListItems: Awaited<ReturnType<typeof getNotecardListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const notecardListItems = await getNotecardListItems({ userId });
    return json<LoaderData>({ notecardListItems });
};

export default function NotecardsPage() {
    const data = useLoaderData() as LoaderData;
    const user = useUser();

    return (
        <div className="flex h-full min-h-screen flex-col">
            <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
                <h1 className="text-3xl font-bold">
                    <Link to=".">Notecards</Link>
                </h1>
                <p>{user.email}</p>
                <Form action="/logout" method="post">
                    <button
                        type="submit"
                        className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                    >
                        Logout
                    </button>
                </Form>
            </header>

            <main className="flex h-full bg-white">
                <div className="h-full w-80 border-r bg-gray-50">
                    <Link to="new" className="block p-4 text-xl text-blue-500">
                        + New Notecard
                    </Link>

                    <hr />

                    {data.notecardListItems.length === 0 ? (
                        <p className="p-4">No notecards yet</p>
                    ) : (
                        <ol>
                            {data.notecardListItems.map((notecard) => (
                                <li key={notecard.id}>
                                    <NavLink
                                        className={({ isActive }) =>
                                            `block border-b p-4 text-xl ${
                                                isActive ? "bg-white" : ""
                                            }`
                                        }
                                        to={notecard.id}
                                    >
                                        📝 {notecard.sideOne}
                                    </NavLink>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
