"use server";

import axios from "axios";
import { cookies, headers } from "next/headers";

const host = headers().get("host");
const cookieStore = cookies();
const access_token = cookieStore.get("access_token");

interface typeAnd_id {
  type: "admin" | "owner" | "people";
  _id: string;
}

export async function getTagsPage() {
  try {
    const { data } = await axios.get(`http://${host}/api/v1/tags`, {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    });
    if (data.success) {
      return data.data;
    }
  } catch (err: any) {
    console.log(err);
  }
}

export async function createVerifyCodeForEmail({ type, _id }: typeAnd_id) {
  try {
    const { data } = await axios.put(
      `http://${host}/api/v1/send-verify-email?type=${type}`,
      { _id },
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    return data;
  } catch (err: any) {
    console.log(err);
  }
}

export async function verifyPeople({
  type,
  email,
}: {
  type: string;
  email: string;
}) {
  try {
    const { data } = await axios.put(
      `http://${host}/api/v1/send-verify-email?type=${type}`,
      { email },
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    return data;
  } catch (err: any) {
    console.log(err);
  }
}

export async function getTagsInfo(tagItem: string) {
  try {
    const { data } = await axios.get(
      `http://${host}/api/v1/tags/tag-item/${tagItem}`,
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    return data;
  } catch (err: any) {
    console.log(err);
  }
}

export async function getPeopleSearchInfo(name: string) {
  try {
    const { data } = await axios.get(
      `http://${host}/api/v1/people-info?peopleName=${name}`
    );
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function insertPeopleToTag(_id: { _id: string }[], tagId: string) {
  try {
    const { data } = await axios.post(
      `http://${host}/api/v1/tags`,
      { _id, tagId },
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function getEventsInfo({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  try {
    const { data } = await axios.get(
      `http://${host}/api/v1/events?month=${month}&year=${year}`,
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function createCashPayment(value: {
  userId: string;
  amount: number;
}) {
  try {
    const { data } = await axios.post(
      `http://${host}/api/v1/payment/cash`,
      value,
      {
        headers: {
          Cookie: `${access_token?.name}=${access_token?.value}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}
