import JobCreateForm from "@/components/shared/jobCreateForm";
import React from "react";
import { useRouter as useNextRouter } from "next/router";

type Props = {};

const Index = (props: Props) => {
  const nextRouter = useNextRouter();
  const { jobID }: any = nextRouter.query;
  const jobId = jobID?.[0];
  return <JobCreateForm jobId={jobId} />;
};

export default Index;
