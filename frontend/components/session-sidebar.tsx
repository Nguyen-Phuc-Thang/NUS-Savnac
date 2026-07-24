'use client';

import { useSession } from 'next-auth/react';
import { AppSidebar } from '@/components/app-sidebar';

export default function SessionSidebar() {
    const { data: session } = useSession();

    return (
        <AppSidebar
            uid={session?.user?.id ?? ''}
            displayName={session?.user?.name ?? 'User'}
            email={session?.user?.email ?? ''}
        />
    );
}
