import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TagService } from '../services/tag.service';
import { CreateTagDto, UpdateTagDto } from '../models/tag.model';

export const useTags = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['admin-tags'],
    queryFn: () => TagService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateTagDto) => TagService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tags'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, dto }: { slug: string; dto: UpdateTagDto }) => TagService.update(slug, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tags'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (slug: string) => TagService.remove(slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tags'] }),
  });

  return { listQuery, createMutation, updateMutation, removeMutation };
}; 