import axios, { AxiosError } from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { ZodFormattedError } from "zod";
import { Input, TInput } from "../lib/validations/createBookmark";

interface Props {
  adminKey: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const adminKey = ctx.req.cookies.admin_key;
  const isValid = adminKey === process.env.ADMIN_KEY;

  if (!adminKey || !isValid) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      adminKey,
    },
  };
};

const Create: NextPage<Props> = ({ adminKey }) => {
  const [formbody, setFormBody] = useState<Partial<TInput>>({ adminKey });
  const [formerror, setFormError] = useState<ZodFormattedError<TInput>>();

  useEffect(() => {
    const res = Input.safeParse(formbody);
    const data = res.success ? undefined : res.error.format();
    setFormError(data);
  }, [formbody]);

  const { isLoading, mutate } = useMutation<{}, AxiosError, TInput>(
    async (input) => (await axios.post("/api/create", input)).data,
    {
      onError: () => {
        toast.error("Something went wrong 😔");
      },
      onSuccess: () => {
        toast.success(`Bookmark created successfully`);
      },
    }
  );

  function tryMutate() {
    if (isLoading || !formbody || formerror) {
      return;
    }
    mutate(formbody as TInput);
  }

  return (
    <>
      <div className="p-5">
        <div className="flex flex-col gap-2 border border-neutral-600 rounded p-5 w-96">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) =>
              setFormBody((body) => ({ ...body, name: e.target.value }))
            }
          />
          {formerror?.name?._errors.map((err, i) => (
            <p key={i} className="text-red-500">
              • {err}
            </p>
          ))}
          <input
            type="text"
            placeholder="URL"
            onChange={(e) =>
              setFormBody((body) => ({ ...body, url: e.target.value }))
            }
          />
          {formerror?.url?._errors.map((err, i) => (
            <p key={i} className="text-red-500">
              • {err}
            </p>
          ))}
          <input
            type="text"
            placeholder="Icon"
            onChange={(e) =>
              setFormBody((body) => ({ ...body, icon: e.target.value }))
            }
          />
          {formerror?.icon?._errors.map((err, i) => (
            <p key={i} className="text-red-500">
              • {err}
            </p>
          ))}
          <button
            className={`rounded p-1 px-4 
            ${isLoading && "animate-pulse"}
            ${!formerror && !isLoading && "hover:bg-cyan-600"}
            ${formerror ? "bg-cyan-900" : "bg-cyan-700"}`}
            onClick={() => tryMutate()}
            disabled={isLoading || !!formerror}
          >
            {isLoading ? "creating..." : "create"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Create;
