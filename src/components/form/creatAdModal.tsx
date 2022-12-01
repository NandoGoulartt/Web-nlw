import * as Dialog from '@radix-ui/react-dialog';
import { Input } from './Input';
import { Check, GameController } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useEffect, useState, FormEvent } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import axios from 'axios';

interface Game {
    id: string;
    title: string;
}

export function CreateAdModal() {
    const [games, setGames] = useState<Game[]>([])
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [useVoiceChannel, setUseVoiceChannel] = useState(false)

    useEffect(() => {
        axios('http://localhost:3333/games').then(response => {
            setGames(response.data)
        })
    }, [])

   async function handleCreated(event: FormEvent) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)
        console.log(data)
        console.log(useVoiceChannel)
        console.log(weekDays)


        try{
            await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
                "discord": data.discord,
                "game": data.game,
                'hourEnd': data.hourEnd,
                'hoursStart': data.hoursStart,
                'name': data.name,
                "yearsPlaying": Number(data.yearsPlaying),
                'weekDays': weekDays.map(Number),
                "useVoiceChannel": useVoiceChannel
            })

            alert('Anuncio criado com sucesso!')
        } catch (err){
            alert('Erro ao criar o anuncio')
            console.log(err)
        }
        
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed' />

            <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
                <Dialog.Title className='text-3xl text-white font-black'>Publique um anúncio</Dialog.Title>

                <form onSubmit={handleCreated} className='mt-8 flex flex-col gap-4'>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="game" className='font-semibold'>Qual o game?</label>
                        <select
                            name='game'
                            id='game' defaultValue="" className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'>
                            <option disabled value="">Selecione o game que deseja jogar</option>
                            {games.map(game => {
                                return (
                                    <option key={game.id} value={game.id}>{game.title}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="name">Seu nome (ou nickname)</label>
                        <Input name='name' id='name' placeholder='Como te chamam dentro do game?' />
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                            <Input name='yearsPlaying' id='yearsPlaying' type="number" placeholder='Tudo bem ser ZERO' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="discord">Qual seu discord?</label>
                            <Input name='discord' id='discord' placeholder='Usuoario#0000' />
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="weekDays">Quando costuma jogar?</label>
                            <ToggleGroup.Root
                                type='multiple'
                                className='grid grid-cols-4 gap-2'
                                value={weekDays}
                                onValueChange={setWeekDays}
                            >
                                <ToggleGroup.Item
                                    value="0"
                                    title='Domingo'
                                    className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('0') ? 'bg-zinc-400' : ''}`}
                                >D
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    title='Segunda'
                                    value='1'
                                    className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('1') ? 'bg-zinc-400' : ''}`}
                                >S</ToggleGroup.Item>
                                <ToggleGroup.Item
                                    title='Terça'
                                    value='2'
                                    className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('2') ? 'bg-zinc-400' : ''}`}
                                >T
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    title='Quarta'
                                    value='3'
                                    className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('3') ? 'bg-zinc-400' : ''}`}
                                >
                                    Q</ToggleGroup.Item>
                                <ToggleGroup.Item
                                    title='Quinta'
                                    value='4'
                                    className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('4') ? 'bg-zinc-400' : ''}`}>
                                    Q</ToggleGroup.Item>
                                <ToggleGroup.Item
                                    title='Sexta'
                                    value='5'
                                    className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('5') ? 'bg-zinc-400' : ''}`}>S
                                </ToggleGroup.Item>
                                <ToggleGroup.Item
                                    title='Sábado'
                                    value='6'
                                    className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('6') ? 'bg-zinc-400' : ''}`}>
                                    S</ToggleGroup.Item>
                            </ToggleGroup.Root>
                        </div>
                        <div className='flex flex-col gap-2 flex-1'>
                            <div>
                                <label htmlFor="hoursStart">Qual horário do dia?</label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Input name='hoursStart' id='hoursStart' type="time" placeholder='De' />
                                    <Input name='hourEnd' id='hourEnd' type="time" placeholder='Até' />
                                </div>
                            </div>
                        </div>
                    </div>

                    <label className='mt-2 flex gap-2 items-center text-sm'>
                        <Checkbox.Root
                            onCheckedChange={(checked) => {
                                if (checked === true) {
                                    setUseVoiceChannel(true)
                                } else {
                                    setUseVoiceChannel(false)
                                }
                            }}
                            className='w-6 h-6 p-1 rounded bg-zinc-900'>
                            <Checkbox.Indicator>
                                <Check className='w-4 h-4 text-emerald-400' />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        Constumo me conectar ao chat de voz
                    </label>

                    <footer className='mt-4 flex justify-end gap-4'>
                        <Dialog.Close
                            type='button'
                            className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'>Cancelar</Dialog.Close>
                        <button className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600' type='submit'>
                            <GameController className='w-6 h-6' />
                            Encontrar duo
                        </button>
                    </footer>


                </form>
            </Dialog.Content>
        </Dialog.Portal>
    )
}