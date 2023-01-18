import { useState, useCallback } from "react";
import TagTextField from "./TagTextField";

function DetailedSearchForm({ tags, setTags }) {
  return <TagTextField value={tags} setValue={setTags} />;
}

export default DetailedSearchForm;
