import { useState } from "react";
import { useGetLocalizedText } from "./useGetLocalizedText";
import { useTrackComponent } from "./useTrackComponent";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import RedditIcon from '@mui/icons-material/Reddit';
import PinterestIcon from '@mui/icons-material/Pinterest';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import type { Social } from "../types/Social";

export interface UseSocialFormProps {
  social: Social;
  onSave: (social: Social) => void;
  onCancel: () => void;
  culture?: string;
}

export function useSocialForm({ social, onSave, onCancel, culture }: UseSocialFormProps) {
  const text = useGetLocalizedText(culture ?? 'en-us')?.SocialForm || {
    legend: 'Edit Social Link',
    name: 'Name:',
    url: 'URL:',
    save: 'Save',
    cancel: 'Cancel'
  };
  useTrackComponent('SocialForm', { social, onSave, onCancel, culture });
  const [form, setForm] = useState<Social>(social);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  const socialNetworks = [
    { name: 'Facebook', Icon: FacebookIcon },
    { name: 'Twitter', Icon: TwitterIcon },
    { name: 'Instagram', Icon: InstagramIcon },
    { name: 'LinkedIn', Icon: LinkedInIcon },
    { name: 'YouTube', Icon: YouTubeIcon },
    { name: 'Reddit', Icon: RedditIcon },
    { name: 'Pinterest', Icon: PinterestIcon },
    { name: 'GitHub', Icon: GitHubIcon },
    { name: 'Google', Icon: GoogleIcon },
  ];

  const handleIconClick = (networkName: string) => {
    setForm((prev) => ({ ...prev, Name: networkName }));
  };

  return {
    text,
    form,
    handleChange,
    handleSubmit,
    socialNetworks,
    handleIconClick,
    onCancel,
  };
}
