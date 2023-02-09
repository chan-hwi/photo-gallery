import TagTextField from "./TagTextField";
import type { TagType } from '@/types/models';

interface paramType {
  tags: TagType[];
  setTags: (newTags : TagType[] | ((newTags : TagType[]) => TagType[])) => void;
};

function DetailedSearchForm({ tags, setTags } : paramType) {
  return <TagTextField value={tags} setValue={setTags} />;
}

export default DetailedSearchForm;
