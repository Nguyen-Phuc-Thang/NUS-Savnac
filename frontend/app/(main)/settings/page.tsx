'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function Settings() {
    const { data: session, update } = useSession();
    const userId = session?.user?.id;

    const [name, setName] = useState(session?.user?.name ?? '');
    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    const handleSubmit = async () => {
        if (!userId) return;

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user?userId=${userId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                }),
            },
        );

        await update({
            name,
        });

        toast.success("Display name updated successfully.")
    };

    return (
        <Tabs defaultValue="profile" className="w-100">
            <TabsList className="gap-1 h-8 p-1">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Details of your profile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            <Field className="pb-2 py-1">
                                <FieldLabel htmlFor="display-name">
                                    Display Name
                                </FieldLabel>
                                <Input
                                    id="display-name"
                                    placeholder="Name here"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <FieldDescription>
                                    You may change your display name here.
                                </FieldDescription>
                            </Field>
                            <Field className="pb-2 py-1">
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    value={session?.user?.email ?? ''}
                                    disabled
                                />
                            </Field>

                            <div className="flex justify-end mt-2">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your account password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Currently unavailable due to backend limitation.
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
