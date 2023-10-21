import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './components/ui/button';
import { useUserStore } from './store/store';

function App() {
	const user = useUserStore((state) => state.user);
	const login = useUserStore((state) => state.login);
	const logout = useUserStore((state) => state.logout);
	const getMe = useUserStore((state) => state.getMe);
	const [loginPending, setLoginPending] = useState(false);
	const [userFetched, setUserFetched] = useState(false);

	console.log({ user });

	const loginForm = useForm<{
		username: string;
		password: string;
	}>({
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onSubmit = () => {
		const values = loginForm.getValues();
		setLoginPending(true);
		login(values.username, values.password)
			.catch(console.error)
			.finally(() => {
				setLoginPending(false);
			});
	};

	useEffect(() => {
		getMe()
			.catch(console.error)
			.finally(() => {
				setUserFetched(true);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!userFetched) {
		return <p>Loading...</p>;
	}

	return (
		<>
			{user
				? (
					<div>
						<h1>Welcome {user.username}</h1>
						<Button onClick={logout}>Logout</Button>
					</div>
				)
				: (
					<Form {...loginForm}>
						<Card className='m-5 w-[50%] mx-auto'>
							<CardHeader>
								<CardTitle>Login</CardTitle>
							</CardHeader>
							<CardContent>
								<form onSubmit={loginForm.handleSubmit(onSubmit)} className='space-y-2'>
									<FormField
										control={loginForm.control}
										name='username'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={loginForm.control}
										name='password'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input type='password' {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<Button type='submit' disabled={loginPending}>Login</Button>
								</form>
							</CardContent>
						</Card>
					</Form>
				)}
		</>
	);
}

export default App;
