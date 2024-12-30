import { Metadata as NextMetadata } from 'next';

type Params = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<NextMetadata> {
  return {
    title: `Edit Account ${params.id}`,
  };
}
