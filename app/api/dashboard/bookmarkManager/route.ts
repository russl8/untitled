import clientPromise from "@/lib/mongodb";
import { getCurrentUserOrGuestID } from "../../helpers";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const id = await getCurrentUserOrGuestID();
    const mongoDbClient = await clientPromise;

    if (!mongoDbClient) {
      return NextResponse.json(
        { error: "Server error, Mongodb client not found" },
        { status: 500 }
      );
    }

    const db = mongoDbClient.db("untitled");
    const userBookmarks = await db
      .collection("bookmarks")
      .find({ userId: id })
      .toArray();
    return NextResponse.json(
      { message: "Success", bookmarks: userBookmarks },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
