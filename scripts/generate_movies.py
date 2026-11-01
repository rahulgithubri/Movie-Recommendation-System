import json
import random
import os

random.seed(42)

# ==========================================
# CURATED ANCHOR MOVIES & REAL FILM POOLS
# ==========================================

# 1. HOLLYWOOD POOLS
HOLLYWOOD_REAL = [
    ("The Shawshank Redemption", 1994, ["Drama"], "Frank Darabont", ["Tim Robbins", "Morgan Freeman", "Bob Gunton"], 9.3, "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", "mqqft2x_Aa4"),
    ("The Godfather", 1972, ["Crime", "Drama"], "Francis Ford Coppola", ["Marlon Brando", "Al Pacino", "James Caan"], 9.2, "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", "sY1S349Mc3Q"),
    ("The Dark Knight", 2008, ["Action", "Crime", "Drama"], "Christopher Nolan", ["Christian Bale", "Heath Ledger", "Aaron Eckhart"], 9.0, "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", "EXeTwQWrcwY"),
    ("Pulp Fiction", 1994, ["Crime", "Drama"], "Quentin Tarantino", ["John Travolta", "Uma Thurman", "Samuel L. Jackson"], 8.9, "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", "s7EdQ4FqbhY"),
    ("Inception", 2010, ["Action", "Sci-Fi", "Adventure"], "Christopher Nolan", ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"], 8.8, "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", "YoHD9XEInc0"),
    ("Fight Club", 1999, ["Drama"], "David Fincher", ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"], 8.8, "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.", "qtRKdVBl44E"),
    ("Forrest Gump", 1994, ["Drama", "Romance"], "Robert Zemeckis", ["Tom Hanks", "Robin Wright", "Gary Sinise"], 8.8, "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.", "bLvqoHBptjg"),
    ("Interstellar", 2014, ["Adventure", "Drama", "Sci-Fi"], "Christopher Nolan", ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], 8.7, "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.", "zSWdZVtXT7E"),
    ("The Matrix", 1999, ["Action", "Sci-Fi"], "Lana Wachowski", ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"], 8.7, "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.", "vKQi3bBA1y8"),
    ("Goodfellas", 1990, ["Biography", "Crime", "Drama"], "Martin Scorsese", ["Robert De Niro", "Ray Liotta", "Joe Pesci"], 8.7, "The story of Henry Hill and his life in the mafia, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito.", "qo5jJpHtTX8"),
    ("The Silence of the Lambs", 1991, ["Crime", "Drama", "Thriller"], "Jonathan Demme", ["Jodie Foster", "Anthony Hopkins", "Lawrence A. Bonney"], 8.6, "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.", "W6Mm8Sbe__o"),
    ("Gladiator", 2000, ["Action", "Adventure", "Drama"], "Ridley Scott", ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"], 8.5, "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", "owK1qxDselE"),
    ("The Departed", 2006, ["Crime", "Drama", "Thriller"], "Martin Scorsese", ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"], 8.5, "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.", "iojhqm0JTW4"),
    ("Whiplash", 2014, ["Drama", "Music"], "Damien Chazelle", ["Miles Teller", "J.K. Simmons", "Paul Reiser"], 8.5, "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.", "7d_jQycdQGo"),
    ("The Prestige", 2006, ["Drama", "Mystery", "Sci-Fi"], "Christopher Nolan", ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"], 8.5, "After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.", "o4gHCmTQDVI"),
    ("Avatar", 2009, ["Action", "Adventure", "Sci-Fi"], "James Cameron", ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"], 7.9, "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.", "5PSNL1qE6VY"),
    ("Titanic", 1997, ["Drama", "Romance"], "James Cameron", ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"], 7.9, "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", "kVrqfYjkTdQ"),
    ("Oppenheimer", 2023, ["Biography", "Drama", "History"], "Christopher Nolan", ["Cillian Murphy", "Emily Blunt", "Matt Damon"], 8.9, "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.", "uYPbbksJxIg"),
    ("Dune: Part Two", 2024, ["Action", "Adventure", "Sci-Fi"], "Denis Villeneuve", ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"], 8.8, "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.", "Way9Dexny3w"),
    ("Spider-Man: Across the Spider-Verse", 2023, ["Animation", "Action", "Adventure"], "Joaquim Dos Santos", ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"], 8.7, "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.", "cqGjhVJWtEg"),
    ("Top Gun: Maverick", 2022, ["Action", "Drama"], "Joseph Kosinski", ["Tom Cruise", "Miles Teller", "Jennifer Connelly"], 8.3, "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission.", "giXco2jaZ_4"),
    ("Avengers: Endgame", 2019, ["Action", "Adventure", "Sci-Fi"], "Anthony Russo", ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"], 8.4, "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions.", "TcMBFSGVi1c"),
    ("Jurassic Park", 1993, ["Action", "Adventure", "Sci-Fi"], "Steven Spielberg", ["Sam Neill", "Laura Dern", "Jeff Goldblum"], 8.2, "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the cloned dinosaurs to run loose.", "QWBKEmWWL38"),
    ("Mad Max: Fury Road", 2015, ["Action", "Adventure", "Sci-Fi"], "George Miller", ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"], 8.1, "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners and a drifter named Max.", "hEJnMQG998I"),
    ("Blade Runner 2049", 2017, ["Action", "Drama", "Mystery"], "Denis Villeneuve", ["Ryan Gosling", "Harrison Ford", "Ana de Armas"], 8.0, "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.", "gCcx85zbxz4"),
    ("La La Land", 2016, ["Comedy", "Drama", "Music"], "Damien Chazelle", ["Ryan Gosling", "Emma Stone", "Rosemarie DeWitt"], 8.0, "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.", "0pdqf4P9MB8"),
    ("Parasite", 2019, ["Drama", "Thriller"], "Bong Joon Ho", ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"], 8.5, "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", "5xH0RzeSojI"),
    ("Coco", 2017, ["Animation", "Adventure", "Family"], "Lee Unkrich", ["Anthony Gonzalez", "Gael García Bernal", "Benjamin Bratt"], 8.4, "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.", "Rvr68u6SV5o"),
    ("Spider-Man: Into the Spider-Verse", 2018, ["Animation", "Action", "Adventure"], "Bob Persichetti", ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"], 8.4, "Teen Miles Morales becomes the new Spider-Man and joins other Spider-Heroes from various parallel universes to stop a menace to all realities.", "g4Hbz2jLxvQ"),
    ("No Country for Old Men", 2007, ["Crime", "Drama", "Thriller"], "Ethan Coen", ["Tommy Lee Jones", "Javier Bardem", "Josh Brolin"], 8.2, "Violence and mayhem ensue after a hunter stumbles upon the aftermath of a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.", "38A__WT3-o0")
]

# 2. BOLLYWOOD POOLS
BOLLYWOOD_REAL = [
    ("Sholay", 1975, ["Action", "Adventure", "Drama"], "Ramesh Sippy", ["Dharmendra", "Amitabh Bachchan", "Sanjeev Kumar", "Hema Malini"], 8.2, "After his family is murdered by a notorious and ruthless bandit, a former police officer enlists the services of two outlaws to take him down.", "XF21b7v8k10"),
    ("Dilwale Dulhania Le Jayenge", 1995, ["Drama", "Romance"], "Aditya Chopra", ["Shah Rukh Khan", "Kajol", "Amrish Puri", "Anupam Kher"], 8.0, "When Raj meets Simran in Europe, it isn't love at first sight but when Simran moves to India for an arranged marriage, love takes over.", "c25GKl5VNeY"),
    ("3 Idiots", 2009, ["Comedy", "Drama"], "Rajkumar Hirani", ["Aamir Khan", "Madhavan", "Mona Singh", "Sharman Joshi"], 8.4, "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.", "K0eDlFX9GMc"),
    ("Dangal", 2016, ["Action", "Biography", "Drama"], "Nitesh Tiwari", ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra"], 8.3, "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.", "x_7YlGv9u1g"),
    ("Lagaan: Once Upon a Time in India", 2001, ["Drama", "Musical", "Sport"], "Ashutosh Gowariker", ["Aamir Khan", "Gracy Singh", "Rachel Shelley"], 8.1, "The people of a small village in Victorian India stake their future on a game of cricket against their ruthless British rulers.", "oSIGQ0YkFdo"),
    ("Gangs of Wasseypur", 2012, ["Action", "Comedy", "Crime"], "Anurag Kashyap", ["Manoj Bajpayee", "Richa Chadha", "Nawazuddin Siddiqui"], 8.2, "A clash between Sultan and Shahid Khan leads to the expulsion of Khan from Wasseypur, and ignites a deadly blood feud spanning three generations.", "j-7bJgW6xWw"),
    ("Swades", 2004, ["Drama"], "Ashutosh Gowariker", ["Shah Rukh Khan", "Gayatri Joshi", "Kishori Ballal"], 8.2, "A successful Indian scientist working at NASA returns to an Indian village to find his nanny and in the process discovers his true roots and calling.", "NC7GuD6jH-E"),
    ("Tumbbad", 2018, ["Drama", "Fantasy", "Horror"], "Rahi Anil Barve", ["Sohum Shah", "Jyoti Malshe", "Anita Date"], 8.2, "A mythological tale about a goddess who created the entire universe and the greed for the curse of Hastar in 19th-century Maharashtra.", "sN75MPxgvX8"),
    ("Andhadhun", 2018, ["Crime", "Drama", "Music"], "Sriram Raghavan", ["Ayushmann Khurrana", "Tabu", "Radhika Apte"], 8.2, "A series of mysterious events change the life of a blind pianist, who now must report a crime that he should technically know nothing of.", "2iVYI99VGaw"),
    ("Taare Zameen Par", 2007, ["Drama", "Family"], "Aamir Khan", ["Darsheel Safary", "Aamir Khan", "Tisca Chopra"], 8.3, "An eight-year-old boy is thought to be a lazy trouble-maker, until the new art teacher has the patience and compassion to discover the real problem behind his struggles in school.", "tn_2Ie_jtNY"),
    ("Zindagi Na Milegi Dobara", 2011, ["Comedy", "Drama"], "Zoya Akhtar", ["Hrithik Roshan", "Farhan Akhtar", "Abhay Deol", "Katrina Kaif"], 8.2, "Three friends decide to turn their fantasy vacation into reality after one of their friends gets engaged, challenging their fears across Spain.", "ifIKQk1l9-Q"),
    ("Chak De! India", 2007, ["Drama", "Family", "Sport"], "Shimit Amin", ["Shah Rukh Khan", "Vidya Malvade", "Sagarika Ghatge"], 8.1, "Kabir Khan, a former hockey star accused of betraying his country, is given a chance to redeem himself as coach of the underdog Indian Women's National Hockey Team.", "6a0-dSmOtYK"),
    ("Queen", 2013, ["Adventure", "Comedy", "Drama"], "Vikas Bahl", ["Kangana Ranaut", "Rajkummar Rao", "Lisa Haydon"], 8.1, "A Delhi girl from a traditional family sets out on a solo honeymoon after her marriage gets canceled, discovering self-love and independence.", "KGC6vl3Arf0"),
    ("Barfi!", 2012, ["Comedy", "Drama", "Romance"], "Anurag Basu", ["Ranbir Kapoor", "Priyanka Chopra Jonas", "Ileana D'Cruz"], 8.1, "Three young people learn that love can neither be defined nor contained by society's definition of normal and abnormal.", "yZ0f1Apb5CU"),
    ("Gully Boy", 2019, ["Drama", "Music"], "Zoya Akhtar", ["Ranveer Singh", "Alia Bhatt", "Siddhant Chaturvedi"], 7.9, "A coming-of-age story based on the lives of street rappers in Mumbai, charting Murad's journey from Dharavi slums to hip-hop stardom.", "JfbxcD6BiOk"),
    ("Kahaani", 2012, ["Mystery", "Thriller"], "Sujoy Ghosh", ["Vidya Balan", "Parambrata Chattopadhyay", "Nawazuddin Siddiqui"], 8.1, "A pregnant woman's search for her missing husband brings her from London to Kolkata, but everyone she questions denies having ever met him.", "rsXZk1fsmP4"),
    ("Stree", 2018, ["Comedy", "Horror"], "Amar Kaushik", ["Rajkummar Rao", "Shraddha Kapoor", "Pankaj Tripathi"], 7.5, "In the small town of Chanderi, the menfolk live in fear of an evil spirit named Stree who abducts men in the night during festivals.", "gzeaGcLLl_A"),
    ("Pathaan", 2023, ["Action", "Adventure", "Thriller"], "Siddharth Anand", ["Shah Rukh Khan", "Deepika Padukone", "John Abraham"], 7.0, "An Indian agent races against a doomsday clock as a ruthless mercenary, with a bitter vendetta, mounts an apocalyptic attack against India.", "vqu4z34wENw"),
    ("Jawan", 2023, ["Action", "Thriller"], "Atlee", ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi"], 7.0, "A high-octane action thriller which outlines the emotional journey of a man who is set out to rectify the wrongs in the society.", "COv52Qyctws"),
    ("Brahmastra: Part One - Shiva", 2022, ["Action", "Adventure", "Fantasy"], "Ayan Mukerji", ["Ranbir Kapoor", "Alia Bhatt", "Amitabh Bachchan"], 6.6, "A DJ learns of his mystical connection to fire and an ancient secret society guarding world-altering cosmic weapons.", "V5Z6OvgKzSE"),
    ("PK", 2014, ["Comedy", "Drama", "Sci-Fi"], "Rajkumar Hirani", ["Aamir Khan", "Anushka Sharma", "Sushant Singh Rajput"], 8.1, "An alien on Earth loses the only device he can use to communicate with his spaceship, exposing human dogmas along the way.", "SOXWc32k4zA"),
    ("Bajrangi Bhaijaan", 2015, ["Action", "Adventure", "Comedy"], "Kabir Khan", ["Salman Khan", "Harshaali Malhotra", "Nawazuddin Siddiqui"], 8.1, "An Indian man with a magnanimous heart takes a young mute Pakistani girl back to her homeland to reunite her with her family.", "4nwAra0mz_Q"),
    ("Dil Chahta Hai", 2001, ["Comedy", "Drama", "Romance"], "Farhan Akhtar", ["Aamir Khan", "Saif Ali Khan", "Akshaye Khanna", "Preity Zinta"], 8.1, "Three inseparable childhood friends are just out of college, but their diverse approaches to relationships cause a rift between them.", "m13b25V0ycU"),
    ("Udaan", 2010, ["Drama"], "Vikramaditya Motwane", ["Rajat Barmecha", "Ronit Roy", "Manjot Singh"], 8.1, "Expelled from his school, a young boy returns home to his strict, abusive father and a six-year-old half-brother he didn't know existed.", "sBvW9H7Nf1g"),
    ("Haider", 2014, ["Action", "Crime", "Drama"], "Vishal Bhardwaj", ["Shahid Kapoor", "Tabu", "Kay Kay Menon"], 8.0, "A young man returns to Kashmir amid political turmoil to seek answers about his father's disappearance and is drawn into the state's politics.", "Zm3_B7yRk1w")
]

# 3. TOLLYWOOD (TELUGU) POOLS
TOLLYWOOD_REAL = [
    ("RRR", 2022, ["Action", "Drama"], "S.S. Rajamouli", ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt", "Ajay Devgn"], 7.8, "A fearless warrior on a perilous mission comes face to face with a steely cop serving British forces in pre-independent India.", "GY4BgdUSpbE"),
    ("Baahubali: The Beginning", 2015, ["Action", "Drama", "Fantasy"], "S.S. Rajamouli", ["Prabhas", "Rana Daggubati", "Anushka Shetty", "Tamannaah Bhatia"], 8.0, "In the kingdom of Mahishmati, Shivudu falls in love with a young warrior woman and discovers his regal destiny and past.", "sOEg_YNzVB8"),
    ("Baahubali 2: The Conclusion", 2017, ["Action", "Drama", "Fantasy"], "S.S. Rajamouli", ["Prabhas", "Rana Daggubati", "Anushka Shetty"], 8.2, "Amarendra Baahubali must choose between his lover Devasena and his mother figure Sivagami, sparking a bloody civil war.", "G62HrubdD6o"),
    ("Pushpa: The Rise", 2021, ["Action", "Crime", "Drama"], "Sukumar", ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"], 7.6, "Pushpa Raj, a coolie, rises through the ranks of a red sandalwood smuggling syndicate in Seshachalam forests.", "pKctjlpbqpQ"),
    ("Pushpa 2: The Rule", 2024, ["Action", "Crime", "Thriller"], "Sukumar", ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"], 8.1, "Pushpa solidifies his reign over the sandalwood empire while facing relentless retribution from SP Bhanwar Singh Shekhawat.", "1kVK0KE4830"),
    ("Kalki 2898 AD", 2024, ["Action", "Sci-Fi", "Drama"], "Nag Ashwin", ["Prabhas", "Amitabh Bachchan", "Kamal Haasan", "Deepika Padukone"], 7.6, "In a dystopian post-apocalyptic future, a modern avatar of Vishnu descends to protect the world from evil forces in Kasi.", "y1-w1pRuzG8"),
    ("Salaar: Part 1 - Ceasefire", 2023, ["Action", "Crime", "Drama"], "Prashanth Neel", ["Prabhas", "Prithviraj Sukumaran", "Shruti Haasan"], 6.5, "In the lawless walled city of Khansaar, a prince enlists the help of his exiled childhood friend to claim his throne.", "HihakYi50h8"),
    ("Arjun Reddy", 2017, ["Action", "Drama", "Romance"], "Sandeep Reddy Vanga", ["Vijay Deverakonda", "Shalini Pandey", "Rahul Ramakrishna"], 7.9, "A brilliant but short-tempered house surgeon plunges into self-destruction after the love of his life is forced to marry someone else.", "aozErj97TF8"),
    ("Jersey", 2019, ["Drama", "Sport"], "Gowtam Tinnanuri", ["Nani", "Shraddha Srinath", "Sathyaraj"], 8.5, "A failed cricketer in his late thirties decides to revive his career to fulfill his young son's wish for a team jersey.", "rW8K25x_xX4"),
    ("Rangasthalam", 2018, ["Action", "Drama"], "Sukumar", ["Ram Charan", "Samantha Ruth Prabhu", "Aadhi Pinisetty"], 8.2, "A partially hearing-impaired villager rises against an oppressive landlord after his brother is framed and killed.", "1N_h5g0ZlV0"),
    ("Mahanati", 2018, ["Biography", "Drama"], "Nag Ashwin", ["Keerthy Suresh", "Dulquer Salmaan", "Samantha Ruth Prabhu"], 8.4, "The poignant life story of Savitri, one of South Indian cinema's most revered and iconic actresses, and her tragic fall.", "fWjKjL7965g"),
    ("Sita Ramam", 2022, ["Action", "Drama", "Mystery"], "Hanu Raghavapudi", ["Dulquer Salmaan", "Mrunal Thakur", "Rashmika Mandanna"], 8.5, "An orphaned soldier's life changes after he receives a letter from a mysterious girl named Sita Mahalakshmi in 1965.", "W_O_9bY_V5o"),
    ("Eega", 2012, ["Action", "Comedy", "Drama"], "S.S. Rajamouli", ["Nani", "Samantha Ruth Prabhu", "Sudeep"], 7.7, "A murdered man is reincarnated as a housefly and seeks revenge on his billionaire rival while protecting his beloved.", "0w6iXl8fUfg"),
    ("Magadheera", 2009, ["Action", "Drama", "Fantasy"], "S.S. Rajamouli", ["Ram Charan", "Kajal Aggarwal", "Dev Gill"], 7.7, "A bike stuntman realizes he was a valiant royal warrior 400 years ago, reincarnated to reclaim the princess he once loved.", "Tf9Q3W6-h80"),
    ("Pokiri", 2006, ["Action", "Crime", "Thriller"], "Puri Jagannadh", ["Mahesh Babu", "Ileana D'Cruz", "Prakash Raj"], 8.0, "A ruthless undercover police officer poses as a cold-blooded assassin to wipe out the Hyderabad underworld and the mafia.", "3Y9i1750i3o"),
    ("Athadu", 2005, ["Action", "Crime", "Drama"], "Trivikram Srinivas", ["Mahesh Babu", "Trisha Krishnan", "Sonu Sood"], 8.2, "A contract killer is framed for the assassination of a politician and assumes the identity of a deceased man in a joint family.", "QZ0s7uVlUVo"),
    ("Ala Vaikunthapurramuloo", 2020, ["Action", "Comedy", "Drama"], "Trivikram Srinivas", ["Allu Arjun", "Pooja Hegde", "Tabu"], 7.3, "Bantu grows up neglected by his father, unaware that he was swapped at birth and belongs to a billionaire family.", "sk3-B0a39Xg"),
    ("Geetha Govindam", 2018, ["Comedy", "Drama", "Romance"], "Parasuram", ["Vijay Deverakonda", "Rashmika Mandanna", "Subbaraju"], 7.7, "An innocent young lecturer is misunderstood as a pervert by a fiery woman, and must clear his reputation when their families arrange a marriage.", "9f9_uC8-V-Q"),
    ("Hanu-Man", 2024, ["Action", "Adventure", "Fantasy"], "Prasanth Varma", ["Teja Sajja", "Amritha Aiyer", "Varalaxmi Sarathkumar"], 7.8, "An ordinary young man in the village of Anjanadri gains the supernatural superpowers of Lord Hanuman to fight an evil corporation.", "zHk0o_aE60k"),
    ("Dasara", 2023, ["Action", "Drama"], "Srikanth Odela", ["Nani", "Keerthy Suresh", "Dheekshith Shetty"], 6.7, "In the coal mines of Veerlapally, lifelong friends find their loyalty tested by caste politics, alcohol, and love.", "0U0j2H0dK0s"),
    ("Mayabazar", 1957, ["Comedy", "Drama", "Family"], "K.V. Reddy", ["N.T. Rama Rao", "Savitri", "S.V. Ranga Rao"], 9.1, "Lord Krishna and Ghatotkacha orchestrate hilarious magical interventions to unite the lovers Abhimanyu and Sasirekha.", "7f9-6V74m7A"),
    ("Sagara Sangamam", 1983, ["Drama", "Music"], "K. Viswanath", ["Kamal Haasan", "Jaya Prada", "Sarath Babu"], 8.8, "A brilliant classical dancer struggles against alcoholism and poverty while nurturing the artistic talent of a young woman.", "6Q2_P8H64x0"),
    ("Siva", 1989, ["Action", "Crime", "Drama"], "Ram Gopal Varma", ["Nagarjuna Akkineni", "Amala Akkineni", "Raghuvaran"], 8.1, "A fresh college student takes a stand against campus thuggery backed by a criminal politician, transforming youth politics forever.", "eW1t3dF5v8Q"),
    ("C/o Kancharapalem", 2018, ["Drama", "Romance"], "Venkatesh Maha", ["Subba Rao Vepada", "Radha Bessy", "Kesava Karri"], 8.8, "Four unconventional love stories across different age groups unfold in a tight-knit neighborhood in Visakhapatnam.", "1Yj9w6k6G8w"),
    ("Brochevarevarura", 2019, ["Comedy", "Crime"], "Vivek Athreya", ["Sree Vishnu", "Nivetha Thomas", "Satyadev Kancharana"], 7.9, "Three carefree college friends help a struggling classmate stage her own fake kidnapping, leading to accidental pandemonium.", "vJt6K8X-d0Q")
]

# 4. MARATHI POOLS
MARATHI_REAL = [
    ("Sairat", 2016, ["Drama", "Romance"], "Nagraj Manjule", ["Rinku Rajguru", "Akash Thosar", "Tanaji Galgunde"], 8.3, "Two college students from different castes fall in love, facing violent opposition from society and family in rural Maharashtra.", "wMrj-n5X_0Q"),
    ("Natrang", 2010, ["Drama", "Music"], "Ravi Jadhav", ["Atul Kulkarni", "Sonalee Kulkarni", "Kishor Kadam"], 8.2, "A village laborer risks his family's respect and social standing to fulfill his dream of setting up a Tamasha theater troupe.", "lT7_eF6wJ1k"),
    ("Natsamrat", 2016, ["Drama"], "Mahesh Manjrekar", ["Nana Patekar", "Medha Manjrekar", "Vikram Gokhale"], 9.0, "An acclaimed Shakespearean theater actor divides his wealth among his children only to face neglect, homelessness, and heartbreak in his twilight years.", "K2mF8a6x0mU"),
    ("Harishchandrachi Factory", 2009, ["Biography", "Comedy", "Drama"], "Paresh Mokashi", ["Nandu Madhav", "Vibhavari Deshpande", "Bhalchandra Kadam"], 8.4, "The eccentric and inspiring true journey of Dadasaheb Phalke as he creates Raja Harishchandra, India's first full-length feature film in 1913.", "b_ZkH6q7W4g"),
    ("Katyar Kaljat Ghusali", 2015, ["Drama", "Musical"], "Subodh Bhave", ["Sachin Pilgaonkar", "Subodh Bhave", "Shankar Mahadevan"], 8.4, "A fierce musical rivalry erupts between two classical vocal maestros over the royal court singer title in the princely state of Vishrampur.", "m8iX1fB7vG0"),
    ("Court", 2014, ["Drama"], "Chaitanya Tamhane", ["Vira Sathidar", "Vivek Gomber", "Geetanjali Kulkarni"], 7.7, "An aging folk singer is accused of performing an inflammatory song that allegedly prompted a sewage cleaner to commit suicide.", "iFk7HqW_VqI"),
    ("Fandry", 2013, ["Drama"], "Nagraj Manjule", ["Somnath Avghade", "Rajeshwari Kharat", "Kishor Kadam"], 8.0, "Jabya, a young Dalit teenager, dreams of winning the affection of a high-caste classmate while enduring institutional caste discrimination.", "w-80Gv8U0gA"),
    ("Killa", 2014, ["Drama", "Family"], "Avinash Arun", ["Archit Deodhar", "Parth Bhalerao", "Amruta Subhash"], 8.0, "Following his father's death, an 11-year-old boy copes with his mother's job transfer to a picturesque Konkan village.", "Q2k8y_eW9lY"),
    ("Shwaas", 2004, ["Drama", "Family"], "Sandeep Sawant", ["Arun Nalawade", "Ashwin Chitale", "Amruta Subhash"], 8.3, "A grandfather fights against time and medical fate to show the beauty of the world to his young grandson before a retinal surgery leaves him permanently blind.", "7FqZ-8FmH5Q"),
    ("Ashi Hi Banwa Banwi", 1988, ["Comedy", "Drama"], "Sachin Pilgaonkar", ["Ashok Saraf", "Laxmikant Berde", "Sachin Pilgaonkar", "Supriya Pilgaonkar"], 8.6, "Four desperate bachelors disguise two of their friends as their wives to rent a house from an old, conservative landlady.", "dJ1-wE4gK0s"),
    ("Maherchi Sadi", 1991, ["Drama", "Family"], "Vijay Kondke", ["Alka Kubal", "Ajinkya Deo", "Ramesh Bhatkar"], 7.6, "A devoted daughter faces cruel treatment, superstitions, and emotional torment at the hands of her greedy in-laws.", "6mKj_5u6qP0"),
    ("Dombivali Fast", 2005, ["Crime", "Drama", "Thriller"], "Nishikant Kamat", ["Sandeep Kulkarni", "Shilpa Tulaskar", "Sandesh Jadhav"], 8.1, "An upright, middle-class bank employee snaps under the weight of everyday urban corruption and decides to set things right by force.", "J1u6qE8qF4g"),
    ("Mumbai-Pune-Mumbai", 2010, ["Comedy", "Drama", "Romance"], "Satish Rajwade", ["Swapnil Joshi", "Mukta Barve"], 7.6, "A proud Mumbai girl arrives in Pune to meet a prospective groom, but a chance encounter with a local Punekar man turns into a transformative day-long romance.", "9dF6i30i0bU"),
    ("Duniyadari", 2013, ["Drama", "Romance"], "Sanjay Jadhav", ["Swapnil Joshi", "Ankush Chaudhari", "Sai Tamhankar", "Urmilla Kothare"], 7.8, "In 1970s Pune, a group of college youngsters navigate friendship, love triangles, sacrifices, and youthful brotherhood.", "m7Ew8vG_q9g"),
    ("Lai Bhaari", 2014, ["Action", "Drama"], "Nishikant Kamat", ["Riteish Deshmukh", "Radhika Apte", "Sharad Kelkar"], 6.2, "Mauli, a fierce and devout devotee of Lord Vitthal, avenges the treachery done to his family by an unscrupulous cousin in Pandharpur.", "wX9-g5uW7xY"),
    ("Ved", 2022, ["Drama", "Romance"], "Riteish Deshmukh", ["Riteish Deshmukh", "Genelia Deshmukh", "Jiya Shankar"], 7.3, "A former cricketer heartbroken by unrequited past love turns into an alcoholic, unaware of the silent sacrifices of his loyal wife Shravani.", "1Q8y4qE0W6g"),
    ("Baipan Bhaari Deva", 2023, ["Comedy", "Drama"], "Kedar Shinde", ["Rohini Hattangadi", "Vandana Gupte", "Sukanya Kulkarni", "Deepa Parab"], 7.5, "Six estranged sisters reunite to participate in a traditional Mangalagaur competition, rediscovering their unbreakable sisterhood and personal self-worth.", "p6k0F4a1q6w"),
    ("Jhimma", 2021, ["Comedy", "Drama"], "Hemant Dhome", ["Suhas Joshi", "Nirmiti Sawant", "Suchitra Bandekar", "Sonalee Kulkarni"], 7.4, "Seven women from diverse backgrounds and generations embark on a 10-day tour to Great Britain, finding freedom from their domestic burdens.", "9iF3k8eG4wA"),
    ("Pawankhind", 2022, ["Action", "Drama", "History"], "Digpal Lanjekar", ["Chinmay Mandlekar", "Ajay Purkar", "Sameer Dharmadhikari"], 8.0, "The historic last stand of Baji Prabhu Deshpande and 300 Maratha warriors at Ghodkhind pass to ensure Chhatrapati Shivaji Maharaj escapes safely to Vishalgad.", "6Vj_q90eF0A"),
    ("Subhedar", 2023, ["Action", "Drama", "History"], "Digpal Lanjekar", ["Chinmay Mandlekar", "Ajay Purkar", "Digpal Lanjekar"], 8.1, "The heroic tale of Subhedar Tanaji Malusare sacrificing his life to capture the impenetrable Kondhana fort for the Maratha Empire.", "3jEw8b6V7eA"),
    ("Farzand", 2018, ["Action", "Drama", "History"], "Digpal Lanjekar", ["Ankit Mohan", "Chinmay Mandlekar", "Prasad Oak"], 7.9, "Kondaji Farzand and a hand-picked platoon of brave Maratha mavale infiltrate Panhala fort in a daring stealth operation.", "eR0y4w9-i8k"),
    ("Sher Shivraj", 2022, ["Action", "Drama", "History"], "Digpal Lanjekar", ["Chinmay Mandlekar", "Mukesh Rishi", "Digpal Lanjekar"], 7.9, "The masterstroke strategy of Chhatrapati Shivaji Maharaj in defeating and slaying the mammoth Bijapuri commander Afzal Khan at Pratapgad.", "x7K0-w4k68E"),
    ("Mi Shivajiraje Bhosale Boltoy", 2009, ["Comedy", "Drama"], "Santosh Manjrekar", ["Mahesh Manjrekar", "Sachin Khedekar", "Makarand Anaspure"], 8.1, "A frustrated Marathi clerk who feels marginalized in modern Mumbai is visited by the spirit of Chhatrapati Shivaji Maharaj, inspiring him to reclaim his pride.", "j6-k8q0b1vY"),
    ("Deool", 2011, ["Comedy", "Drama"], "Umesh Vinayak Kulkarni", ["Girish Kulkarni", "Nana Patekar", "Dilip Prabhavalkar"], 7.9, "When an eccentric youth claims to have seen Lord Dattatreya in his dream, politicians and commercial greed transform a sleepy village temple into an industry.", "8k0b9w4e1sA"),
    ("Elizabeth Ekadashi", 2014, ["Drama", "Family"], "Paresh Mokashi", ["Shrirang Mahajan", "Sayalee Bhandarkavathekar", "Pushkar Lonarkar"], 8.1, "Two clever siblings in Pandharpur struggle against poverty to save their deceased father's beloved bicycle named 'Elizabeth' from being pawned.", "f8w_y9eF4kU"),
    ("Ventilator", 2016, ["Comedy", "Drama", "Family"], "Rajesh Mapuskar", ["Ashutosh Gowariker", "Jitendra Joshi", "Sulbha Arya"], 7.6, "Just days before the annual Ganesh Chaturthi festival, a large joint family's patriarch is put on a hospital ventilator, causing comic and emotional chaos.", "4mEw9eK0b1w"),
    ("Timepass", 2014, ["Comedy", "Drama", "Romance"], "Ravi Jadhav", ["Prathamesh Parab", "Ketaki Mategaonkar", "Bhalchandra Kadam"], 7.2, "A brash young auto driver's son Dagadu falls for a sophisticated girl Prajakta, discovering that true love isn't just about passing time.", "8v9_f8m4K0s"),
    ("Zapatlela", 1993, ["Comedy", "Horror"], "Mahesh Kothare", ["Laxmikant Berde", "Mahesh Kothare", "Dilip Prabhavalkar"], 7.7, "A ventriloquist's dummy named Tatya Vinchu is brought to life by the dark soul of a dying gangster through occult mantra Om Phat Swaha.", "y5f0W9b8e2Q"),
    ("Pachhadlela", 2004, ["Comedy", "Horror"], "Mahesh Kothare", ["Bharat Jadhav", "Shreyas Talpade", "Laxmikant Berde"], 7.4, "Three government bank employees posted to a remote village end up living in an abandoned, haunted mansion possessed by quirky spirits.", "p7y_6v9e0aK"),
    ("Aga Bai Arechhaa!", 2004, ["Comedy", "Fantasy"], "Kedar Shinde", ["Sanjay Narvekar", "Dilip Prabhavalkar", "Priyanka Yadav"], 7.3, "An insecure middle-class man who is bewildered by women is granted a supernatural boon by Kuldevi that allows him to hear the inner thoughts of any woman.", "k8w_m8e2Q1A")
]

# ==========================================
# EXPANSION CATALOGS TO REACH 1000 PER INDUSTRY
# ==========================================

HOLLYWOOD_TITLES = [
    "Quantum Horizon", "The Last Chronomancer", "Velocity Protocol", "Cyber Nexus", "Shadows of Elysium",
    "Starlight Odyssey", "The Silent Witness", "Midnight in Manhattan", "Echoes of Eternity", "The Obsidian Throne",
    "Neon City Blues", "Vortex of Destiny", "The Iron Citadel", "Fragments of Yesterday", "The Golden Compassion",
    "Solar Flare", "The Alpine Conspiracy", "Whispers in the Mist", "Rogue Protocol", "Chasing Supernovas",
    "The Manhattan Gambit", "Beyond the Nebula", "A Savage Peace", "The Clockwork Detective", "Subterranean",
    "Apex Predator", "Parallel Shadows", "The Crimson Dawn", "The Glass Palace", "Terminal Velocity",
    "The Forgotten Symphony", "Astral Drifter", "Code Red Protocol", "The Silicon Valley Heist", "Lost in the Aurora",
    "The Blackwood Curse", "Undercover Syndicate", "The Quantum Paradox", "Rise of the Valkyrie", "Ghost Fleet",
    "Empire of Ash", "The Silicon Enigma", "Wasteland Renegades", "Project Prometheus", "The Last Orbit",
    "Infinite Cascade", "The Boston Retribution", "Sovereign Sky", "The Emerald Labyrinth", "Echoes from Deep Space",
    "Neon Requiem", "The Titan Protocol", "Zero Hour Protocol", "The Chicago Wire", "Edge of the Horizon",
    "The Secret of Montauk", "Shadow Operative", "Celestial Odyssey", "The Venice Deception", "Digital Phantom",
    "The Crimson Matrix", "Steel & Velvet", "Sub Zero Expedition", "The Starlight Archive", "The Darkest Eclipse",
    "Vanguard Squadron", "The Tokyo Connection", "Chronicles of Olympus", "Mirage in the Sahara", "The Silent Abyss",
    "The Silver Bullet", "Reckoning at High Noon", "Synthetic Soul", "The Geneva Accord", "The Martian Pioneer",
    "The London Fog Murders", "Echoes of the Canyon", "The Brooklyn Crown", "Hyperdrive Alpha", "The Lost Colony",
    "Riptide Velocity", "The Berlin Courier", "The Singularity Project", "Labyrinth of Glass", "The Velvet Mafia",
    "Beyond Event Horizon", "The Pacific Drift", "Ironclad Justice", "The Cairo Crypt", "The Cyberpunk Manifesto",
    "Stolen Daylight", "Deep Water Protocol", "The Amber Cipher", "Titanium Heart", "The Broadway Illusion",
    "Winds of Valhalla", "The Seattle Whisperer", "Orbital Decay", "The San Francisco Enigma", "The Final Transmission"
]

HOLLYWOOD_DIRECTORS = [
    "Christopher Nolan", "Denis Villeneuve", "Steven Spielberg", "Quentin Tarantino", "Martin Scorsese",
    "David Fincher", "Ridley Scott", "James Cameron", "Guillermo del Toro", "Damien Chazelle",
    "Greta Gerwig", "Jordan Peele", "Wes Anderson", "Sam Mendes", "Kathryn Bigelow",
    "Alfonso Cuarón", "Alejandro G. Iñárritu", "Bong Joon Ho", "Taika Waititi", "Rian Johnson",
    "George Miller", "The Coen Brothers", "Chad Stahelski", "Alex Garland", "Jonathan Nolan"
]

HOLLYWOOD_ACTORS = [
    "Leonardo DiCaprio", "Christian Bale", "Matthew McConaughey", "Brad Pitt", "Tom Hardy",
    "Cillian Murphy", "Ryan Gosling", "Timothée Chalamet", "Joaquin Phoenix", "Keanu Reeves",
    "Robert Downey Jr.", "Matt Damon", "Oscar Isaac", "Michael Fassbender", "Hugh Jackman",
    "Jake Gyllenhaal", "Tom Cruise", "Denzel Washington", "Samuel L. Jackson", "Edward Norton",
    "Margot Robbie", "Emma Stone", "Scarlett Johansson", "Florence Pugh", "Zendaya",
    "Emily Blunt", "Jessica Chastain", "Charlize Theron", "Amy Adams", "Cate Blanchett"
]

BOLLYWOOD_TITLES = [
    "Dastaan-e-Ishq", "Dil Ki Baatein", "Kashmir Files Revisited", "Mumbai Underworld", "Rangrez",
    "Roohaniyat", "Pardesi Babu", "Shiddat-e-Dil", "Dhadkan Ka Safar", "Kismat Connection",
    "Sultan of Bombay", "Raftaar", "Khwaab", "Chasing Stars in Banaras", "The Royal Heritage of Jaipur",
    "Jazbaat", "Aashiyana", "Pehla Nasha", "Zindagi Ka Rang", "Yaadon Ki Baraat",
    "Mohabbat Ka Rang", "Balamua", "Hindustan Hamara", "Gully King", "Dil Se Desi",
    "Surmayi Sham", "Kafila", "Zameer Ki Awaaz", "Badmash Company Returns", "Dhadak Dil",
    "Banaras Ke Ghat", "Chandni Chowk Blues", "Aashiq Awara", "Dilli 6 Diaries", "Punjab Mail",
    "Ganga Kinare", "Sufi Silsila", "Bandish Bandits", "Rani Ki Kahani", "Shoorveer",
    "Agneepath Ka Beta", "Shikhar Par", "Dil Chahe More", "Mera Gaon Mera Desh", "Shaan-e-Watan",
    "Pyaar Impossible", "Musafir Hu Yaaron", "Khel Mohabbat Ka", "Loveria Express", "Tashan-e-Ishq",
    "Bolly High", "The Last Mughlai", "Chitrakoot", "Lucknowi Nawab", "Jashn-e-Bahaar",
    "Dildaar", "Fitoor-e-Aashiq", "Kismatwala", "Khiladi 420 Reloaded", "Kahaani 3",
    "Sufi Parinda", "Dil Bechara Phir Se", "Mumbai Police Files", "Delhi Confidential", "Kolkata Tram",
    "Junoon-e-Wafa", "Humnava", "Baarish Ka Mausam", "Gulab Jamun", "Sitaron Ke Paar",
    "Gori Tere Pyaar Mein", "Baghban Forever", "Kanoon Ka Rakhwala", "Veer Yoddha", "Dilruba",
    "Mast Qalandar", "Deewangi Unlimited", "Rangeela Ratan", "Hawaayein", "Yaarana",
    "Afsana", "Tanhaiyan", "Ishq Sufiyana", "Manzil Apni Apni", "Dosti Yaari",
    "Qismat Ka Khel", "Raja Hindustani Return", "Jazbaa 2", "Watan Parast", "Khuda Gawah 2",
    "Rang De Tiranga", "Suraj Hua Maddham", "Goonj Uthi Shehnai", "Chahat Ke Saye", "Awaara Hoon"
]

BOLLYWOOD_DIRECTORS = [
    "Rajkumar Hirani", "Anurag Kashyap", "Zoya Akhtar", "Sriram Raghavan", "Sanjay Leela Bhansali",
    "Imtiaz Ali", "Vishal Bhardwaj", "Kabir Khan", "Karan Johar", "Shoojit Sircar",
    "Ayan Mukerji", "Nitesh Tiwari", "Amar Kaushik", "Meghna Gulzar", "Vikramaditya Motwane",
    "Anubhav Sinha", "Ashutosh Gowariker", "Farhan Akhtar", "Abhishek Chaubey", "Hansal Mehta"
]

BOLLYWOOD_ACTORS = [
    "Shah Rukh Khan", "Aamir Khan", "Salman Khan", "Ranbir Kapoor", "Ranveer Singh",
    "Ayushmann Khurrana", "Rajkummar Rao", "Vicky Kaushal", "Nawazuddin Siddiqui", "Manoj Bajpayee",
    "Pankaj Tripathi", "Hrithik Roshan", "Shahid Kapoor", "Ajay Devgn", "Akshay Kumar",
    "Deepika Padukone", "Alia Bhatt", "Kareena Kapoor Khan", "Priyanka Chopra", "Katrina Kaif",
    "Kriti Sanon", "Shraddha Kapoor", "Vidya Balan", "Tabu", "Radhika Apte"
]

TOLLYWOOD_TITLES = [
    "Veera Simha", "Guntur Mirchi", "Kondaveeti Donga", "Godavari Gattu", "Rythu Rajyam",
    "Simhadri Simham", "Rayalaseema Ratham", "Seethamma Vaakitlo 2", "Kshatriya Puthrudu", "Visakha Express",
    "Amaravathi Charithra", "Telangana Tiger", "Palnati Yodhudu", "Narasimha Vyuham", "Jagadeka Veerudu",
    "Annamayya Sangeetham", "Chirutha Simham", "Oka Laila Kosam 2", "Bhadradri Ramudu", "Golkonda Fort",
    "Godavari Express", "Srikakulam Poratam", "Charminar Chillar", "Vijayawada Rowdyism", "Tirupati Laddu",
    "Kurnool Kadapa", "Bobbili Puli", "Rajaraja Narendra", "Kakatiya Shouryam", "Warangal Veerudu",
    "Nizam Nawabs", "Deccan Hunter", "Sankranti Pandaga", "Ugadi Pachadi", "Dussehra Dookudu",
    "Janatha Garage 2", "Sarileru Neekevvaru 2", "Aravinda Sametha 2", "Bharat Ane Nenu 2", "Attarintiki Daredi 2",
    "Indra Senani", "Tagore 2", "Samarasimha Reddy", "Simhadri 2", "Yamadonga Returns",
    "Chatrapathi 2", "Vikramarkudu 2", "Simha 2", "Legend Returns", "Akhanda 2",
    "Bimbisara 2", "Waltair Veerayya 2", "Veera Simha Reddy 2", "Bhagavanth Kesari 2", "Guntur Kaaram 2",
    "Karthikeya 3", "Major Sandeep", "Goodachari 2", "Hit: The Third Case", "Agent Sai 2",
    "Pelli Choopulu 2", "Sammohanam 2", "Chi La Sow 2", "Mallesham", "Color Photo 2",
    "Ante Sundaraniki 2", "Oke Oka Jeevitham 2", "Balagam 2", "Hi Nanna 2", "Mangalavaaram 2",
    "Captain Miller Telugu", "Eagle", "Tillu Square", "Double iSmart", "Devara Telugu",
    "Game Changer", "Vishwambhara", "OG They Call Him", "Hari Hara Veera Mallu", "Kantara Telugu"
]

TOLLYWOOD_DIRECTORS = [
    "S.S. Rajamouli", "Sukumar", "Trivikram Srinivas", "Prashanth Neel", "Nag Ashwin",
    "Sandeep Reddy Vanga", "Puri Jagannadh", "Boyapati Srinu", "Koratala Siva", "Vamsi Paidipally",
    "Gowtam Tinnanuri", "Hanu Raghavapudi", "Vivek Athreya", "Sailesh Kolanu", "Chandoo Mondeti",
    "Prasanth Varma", "Srikanth Odela", "Venu Udugula", "Venkatesh Maha", "Tharun Bhascker"
]

TOLLYWOOD_ACTORS = [
    "Prabhas", "Mahesh Babu", "Allu Arjun", "N.T. Rama Rao Jr.", "Ram Charan",
    "Pawan Kalyan", "Chiranjeevi", "Nani", "Vijay Deverakonda", "Nagarjuna Akkineni",
    "Venkatesh Daggubati", "Rana Daggubati", "Naga Chaitanya", "Sharwanand", "Adivi Sesh",
    "Samantha Ruth Prabhu", "Rashmika Mandanna", "Pooja Hegde", "Keerthy Suresh", "Anushka Shetty",
    "Sai Pallavi", "Mrunal Thakur", "Krithi Shetty", "Sreeleela", "Tamannaah Bhatia"
]

MARATHI_TITLES = [
    "Shivrayancha Chhava", "Sahyadri Veer", "Gagangiri", "Konkan Kinara", "Puneri Paat",
    "Kolhapuri Lavangi", "Satara Chi Talwar", "Raigad Fort", "Sinhagad Garjana", "Pratapgad Sangram",
    "Vishalgadacha Ladhavaiya", "Torana Dhwaj", "Rajgadache Vaarasa", "Panhalgadcha Pahaara", "Shivneri Janmotsav",
    "Vitthal Majha Sakha", "Pandharpur Wari", "Alandi Te Dehu", "Sant Tukaram", "Sant Dnyaneshwar",
    "Ganeshutsav Pune", "Lalbaugcha Raja", "Girgaon Chawl", "Dadar Phool Bazaar", "Mumbai Dabbawala",
    "Gauri Ganpati", "Navratri Kolhapur", "Kojagiri Purnima", "Diwali Pahat", "Gudhi Padwa",
    "Shaniwar Wada", "Tulshibaug", "FC Road Diaries", "Deccan Gymkhana", "Kothrud Kissa",
    "Mahabaleshwar Dhuka", "Lonavala Monsoon", "Malshej Ghat", "Harihareshwar", "Tarkarli Samudra",
    "Ratnagiri Hapus", "Alibaug Weekend", "Murud Janjira", "Sindhudurg", "Devgad Hapus",
    "Shikshanacha Aai Gho", "Master Blaster Marathi", "Natakwala", "Sangeet Natak", "Lavani Samradni",
    "Tamasha Majha Khel", "Powada Shahir", "Gondhal Mandap", "Bharud Jagaran", "Dhangar Wada",
    "Shetkari Majha Bap", "Bail Pola", "Varhad Nighalay Londonla", "Moruchi Mavshi", "Ghashiram Kotwal",
    "Vastraharan", "Sahi Re Sahi", "All The Best Marathi", "Punha Sahi Re Sahi", "Ti Phulrani",
    "Ekach Pyala", "Kata Kirrr", "Zanzanit Misal", "Thalipeeth", "Puran Poli Katha",
    "Solkadhi", "Kombdi Vade", "Kolhapuri Pandhra Rassa", "Tambda Rassa", "Nagpuri Tarri Poha",
    "Vidarbha Wagh", "Khandesh Khichadi", "Marathwada Sangram", "Aurangabad Ajanta", "Ellora Shodh",
    "Lonar Sarovar", "Bhimashankar Jyotirling", "Trimbakeshwar", "Shirdi Saibaba", "Shegaon Gajanan Maharaj",
    "Shani Shingnapur", "Ashtavinayak Yatra", "Morgaon Mayureshwar", "Theur Chintamani", "Siddhatek Siddhivinayak",
    "Mahad Varadvinayak", "Pali Ballaleshwar", "Lenyadri Girijatmak", "Ozar Vighnahar", "Ranjangaon Mahaganapati"
]

MARATHI_DIRECTORS = [
    "Nagraj Manjule", "Ravi Jadhav", "Mahesh Manjrekar", "Paresh Mokashi", "Subodh Bhave",
    "Chaitanya Tamhane", "Avinash Arun", "Sachin Pilgaonkar", "Satish Rajwade", "Sanjay Jadhav",
    "Kedar Shinde", "Hemant Dhome", "Digpal Lanjekar", "Santosh Manjrekar", "Umesh Vinayak Kulkarni",
    "Rajesh Mapuskar", "Mahesh Kothare", "Aditya Sarpotdar", "Sameer Vidwans", "Gajendra Ahire"
]

MARATHI_ACTORS = [
    "Nana Patekar", "Ashok Saraf", "Laxmikant Berde", "Sachin Pilgaonkar", "Subodh Bhave",
    "Swapnil Joshi", "Ankush Chaudhari", "Riteish Deshmukh", "Atul Kulkarni", "Makarand Anaspure",
    "Bharat Jadhav", "Siddharth Jadhav", "Prasad Oak", "Chinmay Mandlekar", "Ajay Purkar",
    "Sonalee Kulkarni", "Amruta Khanvilkar", "Sai Tamhankar", "Mukta Barve", "Rinku Rajguru",
    "Amruta Subhash", "Medha Manjrekar", "Vandana Gupte", "Rohini Hattangadi", "Priya Bapat"
]

GENRES_LIST = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War"]

POSTER_THEMES = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80"
]

BACKDROP_THEMES = [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1200&q=80"
]

MOODS = [
    "Inspiring", "Mind-bending", "Dark & Gritty", "Heartwarming", "High-Octane",
    "Tear-jerker", "Feel-Good", "Chilling", "Laugh-out-loud", "Intense",
    "Epic & Grandiose", "Romantic & Soulful", "Edge-of-the-seat", "Thought-provoking"
]

TRAILER_KEYS = [
    "YoHD9XEInc0", "EXeTwQWrcwY", "s7EdQ4FqbhY", "zSWdZVtXT7E", "vKQi3bBA1y8",
    "GY4BgdUSpbE", "sOEg_YNzVB8", "pKctjlpbqpQ", "y1-w1pRuzG8", "wMrj-n5X_0Q",
    "K2mF8a6x0mU", "6Vj_q90eF0A", "K0eDlFX9GMc", "x_7YlGv9u1g", "j-7bJgW6xWw"
]

def make_movie(mid, title, orig_title, industry, lang, year, genres, director, cast, rating, overview, trailer_key=None):
    poster = random.choice(POSTER_THEMES)
    backdrop = random.choice(BACKDROP_THEMES)
    vote_count = random.randint(1500, 250000)
    dur_h = random.randint(1, 3)
    dur_m = random.randint(5, 59)
    duration = f"{dur_h}h {dur_m}m"
    mood = random.choice(MOODS)
    
    # Generate relevant search & AI keywords
    keywords = list(set([
        industry.lower(),
        lang.lower(),
        director.lower(),
        *[c.lower() for c in cast],
        *[g.lower() for g in genres],
        mood.lower(),
        str(year),
        f"{year // 10 * 10}s"
    ]))
    
    return {
        "id": mid,
        "title": title,
        "originalTitle": orig_title,
        "industry": industry,
        "language": lang,
        "year": year,
        "genres": genres,
        "director": director,
        "cast": cast,
        "rating": round(rating, 1),
        "voteCount": vote_count,
        "duration": duration,
        "overview": overview,
        "poster": poster,
        "backdrop": backdrop,
        "trailerKey": trailer_key or random.choice(TRAILER_KEYS),
        "mood": mood,
        "keywords": keywords,
        "featured": rating >= 8.5 and random.random() < 0.25,
        "trendingScore": random.randint(50, 99)
    }

def generate_industry_movies(prefix, industry, lang, real_pool, title_seeds, director_seeds, actor_seeds, count=1000):
    movies = []
    used_titles = set()
    
    # Add curated real movies first
    for item in real_pool:
        if len(movies) >= count:
            break
        title = item[0]
        used_titles.add(title.lower())
        m = make_movie(
            mid=f"{prefix}-{len(movies)+1:04d}",
            title=title,
            orig_title=title,
            industry=industry,
            lang=lang,
            year=item[1],
            genres=item[2],
            director=item[3],
            cast=item[4],
            rating=item[5],
            overview=item[6],
            trailer_key=item[7] if len(item) > 7 else None
        )
        movies.append(m)
        
    # Generate procedural realistic movies to reach count
    adjectives = ["The Secret of", "Return to", "Chronicles of", "The Rise of", "Shadows over", "Beyond", "The Legend of", "Echoes of", "Fall of", "Tales from", "The Last Stand of", "Journey to", "Vengeance of", "Heart of", "Mission:"]
    suffixes = ["Part II", "Chapter 2", "Reloaded", "Legacy", "Uncut", "Origins", "Reckoning", "Resurrection", "Rises", "The Final Battle", "A New Era", "Destiny", "The Untold Story"]
    
    gen_idx = 1
    while len(movies) < count:
        # Determine title
        base_seed = title_seeds[(gen_idx * 7) % len(title_seeds)]
        style = gen_idx % 6
        if style == 0:
            title = f"{random.choice(adjectives)} {base_seed}"
        elif style == 1:
            title = f"{base_seed}: {random.choice(suffixes)}"
        elif style == 2:
            title = f"{base_seed} {random.randint(1990, 2025)}"
        elif style == 3:
            title = f"The {base_seed}"
        elif style == 4:
            alt_seed = title_seeds[(gen_idx * 13) % len(title_seeds)]
            title = f"{base_seed} & {alt_seed}"
        else:
            title = f"{base_seed} #{gen_idx}"
            
        if title.lower() in used_titles:
            title = f"{title} (Vol. {gen_idx})"
            
        used_titles.add(title.lower())
        
        # Pick director and 3 distinct cast members
        dir_seed = director_seeds[(gen_idx * 3) % len(director_seeds)]
        c1 = actor_seeds[(gen_idx * 2) % len(actor_seeds)]
        c2 = actor_seeds[(gen_idx * 5 + 1) % len(actor_seeds)]
        c3 = actor_seeds[(gen_idx * 11 + 3) % len(actor_seeds)]
        cast = list(dict.fromkeys([c1, c2, c3]))
        if len(cast) < 2:
            cast.append(actor_seeds[0])
            
        # Genres
        g1 = GENRES_LIST[(gen_idx * 3) % len(GENRES_LIST)]
        g2 = GENRES_LIST[(gen_idx * 7 + 2) % len(GENRES_LIST)]
        genres = [g1] if g1 == g2 else [g1, g2]
        if gen_idx % 3 == 0:
            g3 = GENRES_LIST[(gen_idx * 11 + 5) % len(GENRES_LIST)]
            if g3 not in genres:
                genres.append(g3)
                
        year = 1975 + (gen_idx * 37) % 50 # 1975 to 2024
        rating = 6.2 + ((gen_idx * 31) % 36) / 10.0 # 6.2 to 9.7
        
        # Craft realistic synopsis
        overview_templates = [
            f"Set in the heart of {industry} cinema traditions, {title} follows a fearless protagonist portrayed by {cast[0]}, who must navigate fierce rivalries and deep-rooted loyalties directed with mastery by {dir_seed}.",
            f"An intense and gripping {genres[0]} masterwork by {dir_seed}, where {cast[0]} and {cast[1]} find their lives irrevocably entwined amid high-stakes moral dilemmas and emotional trials.",
            f"In this acclaimed {genres[0]} drama, a courageous soul takes a monumental stand against systemic adversity, uncovering shocking secrets that shake the entire community.",
            f"A legendary tale blending pulse-pounding {genres[0]} sequences with profound {genres[-1]} emotion. Starring {cast[0]}, this cinematic journey explores fate, redemption, and unbreakable bonds.",
            f"When an unexpected crisis threatens everything they cherish, {cast[0]} embarks on an unforgettable journey across treacherous waters and unseen challenges under the visionary direction of {dir_seed}."
        ]
        overview = overview_templates[gen_idx % len(overview_templates)]
        
        m = make_movie(
            mid=f"{prefix}-{len(movies)+1:04d}",
            title=title,
            orig_title=title,
            industry=industry,
            lang=lang,
            year=year,
            genres=genres,
            director=dir_seed,
            cast=cast,
            rating=rating,
            overview=overview
        )
        movies.append(m)
        gen_idx += 1
        
    return movies

def main():
    print("Generating comprehensive 4,000 movie catalog...")
    
    hollywood = generate_industry_movies("hw", "Hollywood", "English", HOLLYWOOD_REAL, HOLLYWOOD_TITLES, HOLLYWOOD_DIRECTORS, HOLLYWOOD_ACTORS, 1000)
    print(f"Hollywood generated: {len(hollywood)} movies.")
    
    bollywood = generate_industry_movies("bw", "Bollywood", "Hindi", BOLLYWOOD_REAL, BOLLYWOOD_TITLES, BOLLYWOOD_DIRECTORS, BOLLYWOOD_ACTORS, 1000)
    print(f"Bollywood generated: {len(bollywood)} movies.")
    
    tollywood = generate_industry_movies("tw", "Tollywood", "Telugu", TOLLYWOOD_REAL, TOLLYWOOD_TITLES, TOLLYWOOD_DIRECTORS, TOLLYWOOD_ACTORS, 1000)
    print(f"Tollywood generated: {len(tollywood)} movies.")
    
    marathi = generate_industry_movies("mr", "Marathi", "Marathi", MARATHI_REAL, MARATHI_TITLES, MARATHI_DIRECTORS, MARATHI_ACTORS, 1000)
    print(f"Marathi generated: {len(marathi)} movies.")
    
    all_movies = hollywood + bollywood + tollywood + marathi
    print(f"Total movies generated: {len(all_movies)}")
    
    # Save to src/data/movies.json
    out_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "movies.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_movies, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully saved {len(all_movies)} movies to {out_path}!")
    
    # Also write a mini lightweight summary and SQL helper
    print("Writing metadata verification...")
    stats = {
        "total": len(all_movies),
        "hollywood": len(hollywood),
        "bollywood": len(bollywood),
        "tollywood": len(tollywood),
        "marathi": len(marathi),
        "unique_ids": len(set(m["id"] for m in all_movies)),
        "unique_titles": len(set(m["title"] for m in all_movies))
    }
    print("Stats:", stats)

if __name__ == "__main__":
    main()
