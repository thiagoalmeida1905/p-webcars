import { useEffect, useState, useContext } from "react";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";
import { FiTrash } from "react-icons/fi";
import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";

interface CarProps {
    id: string;
    name: string;
    year: string;
    price: string | number;
    city: string;
    km: string;
    images: imageCarProps[];
    uid: string;
}

interface imageCarProps {
    name: string;
    uid: string;
    url: string
}



export function Dashboard() {
    const [cars, setCars] = useState<CarProps[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {

        function loadcars() {

            if (!user?.uid) {
                return;
            }


            const carsRef = collection(db, 'cars');
            const queryRef = query(carsRef, where("uid", "==", user.uid))

            getDocs(queryRef)
                .then((snapshot) => {
                    const listcars = [] as CarProps[];

                    snapshot.forEach(doc => {
                        listcars.push({
                            id: doc.id,
                            name: doc.data().name,
                            year: doc.data().year,
                            km: doc.data().km,
                            city: doc.data().city,
                            price: doc.data().price,
                            images: doc.data().images,
                            uid: doc.data().uid
                        })
                    })
                    setCars(listcars);
                })
        }

        loadcars();
    }, [user])

    async function handleDeleteCar(id: string) {
        const docRef = doc(db, "cars", id)
        await deleteDoc(docRef);
        setCars(cars.filter(car => car.id !== id))
    }


    return (
        <Container>
            <DashboardHeader />

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map(car =>
                    <section className="w-full bg-white rounded-lg relative" key={car.id}>

                        <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
                        >
                            <FiTrash size={26} color="#000" />
                        </button>
                        <img
                            className="w-full rounded-lg mb-2 max-h-70"
                            src={car.images[0].url}
                        />
                        <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

                        <div className="flex flex-col px-2">
                            <span>
                                Ano {car.year} | {car.km} KM
                            </span>
                            <strong className="text-black font-bold mt-4">
                                R$ {car.price}
                            </strong>

                        </div>

                        <div className="w-full h-px bg-slate-200 my-2"></div>
                        <div className="px-2 pb-2">
                            <span className="text-black">{car.city}</span>
                        </div>
                    </section>
                )}
            </main>
        </Container>

    )
}

