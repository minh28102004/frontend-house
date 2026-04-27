import { redirect } from 'next/navigation';

/** Đồng bộ URL cũ /new → route thực tế /create */
export default function HostContentNewRedirectPage() {
  redirect('/host/content/create');
}
