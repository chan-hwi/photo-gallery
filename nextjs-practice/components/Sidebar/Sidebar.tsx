"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Search,
  Image as ImageIcon,
  Star,
  Upload,
  CloudUpload,
  FilterAlt,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import DetailedSearchForm from "@/components/Forms/DetailedSearchForm";
import useUser from "@/hooks/useUser";
import { useCallback } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import type { TagType, PostSearchParamsType } from "@/types/models";

function Sidebar() {
  const { user } = useUser();
  const [searchInput, setSearchInput] = useState<string>("");
  const [tags, setTags] = useState<TagType[]>([]);
  const [showSearchForm, setShowSearchForm] = useState<boolean>(false);
  const params = useQueryParams();
  const router = useRouter();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
    []
  );

  const handleSetTag = useCallback(
    (newTags: TagType[] | ((newTags: TagType[]) => TagType[])) => {
      setTags((tags) =>
        typeof newTags === "function" ? newTags(tags) : newTags
      );
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.code !== "Enter") return;

      const filteredParams: PostSearchParamsType = {
        ...params,
        keyword: searchInput,
        tags: tags.map((tag) => tag._id),
      };
      if (!searchInput) delete filteredParams.keyword;
      if (tags.length === 0) delete filteredParams.tags;

      router.push(
        "/posts?" + new URLSearchParams(filteredParams as any).toString()
      );
    },
    [tags, params, router, searchInput]
  );

  return (
    <List style={{ paddingLeft: '8px' }}>
      <ListItem
        sx={{ pb: 2 }}
        secondaryAction={
          <IconButton
            onClick={() => setShowSearchForm((show) => !show)}
            sx={{ transform: "translate(50%)" }}
          >
            <FilterAlt />
          </IconButton>
        }
      >
        <TextField
          label="검색"
          variant="standard"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={searchInput}
          onChange={handleChange}
          onKeyUp={handleSubmit}
        />
      </ListItem>
      <Collapse in={showSearchForm}>
        <ListItem disablePadding sx={{ py: 2 }}>
          <DetailedSearchForm tags={tags} setTags={handleSetTag} />
        </ListItem>
        <Divider />
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton component={Link} href="/posts">
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText>전체 이미지</ListItemText>
        </ListItemButton>
      </ListItem>
      {user && (
        <>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/posts?category=favorites">
              <ListItemIcon>
                <Star />
              </ListItemIcon>
              <ListItemText>즐겨 찾기한 이미지</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={`/posts?author=${user?.profile?.id}`}
            >
              <ListItemIcon>
                <CloudUpload />
              </ListItemIcon>
              <ListItemText>업로드한 이미지</ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/posts/upload">
              <ListItemIcon>
                <Upload />
              </ListItemIcon>
              <ListItemText>업로드</ListItemText>
            </ListItemButton>
          </ListItem>
        </>
      )}
    </List>
  );
}

export default Sidebar;
