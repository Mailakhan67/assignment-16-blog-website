import { components } from "@/components/customComponent";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import Image from "next/image";

export const revalidate=10 //seconds

export async function generateStaticParams(){
const query=`*[_type=='post'] {
"slug":slug.current
}`;
const slugs=await client.fetch(query);
const slugRoutes:string[]=slugs.map((slug:{slug:string})=>(slug.slug))
console.log(slugRoutes);
return slugRoutes.map((slug:string)=>({slug}))
}


export default async function page({params:{slug}}:{params:{slug:string}}) {
  console.log("Slug value:", slug);

const query =`*[_type=='post' && slug.current=="${slug}"]{
  title,summary,image,content,
    author->{bio,image,name}
  }[0]`;
 
 
const post=await client.fetch(query)
console.log(post)
//  console.log(post.title)

  return (
    <article className="mt-12 mb-24 px-2 2xl:px-12 flex flex-col gap-y-8">

      {/* Blog Title */}
      <h1 className="text-xl xs:text-3xl lg:text-5xl font-bold text-dark dark:text-light">
       {post.title}
      
      </h1>

      {/* Featured Image */}
      <Image
        src={urlFor(post.image)}
        width={500}
        height={400}
        alt="AI for everyone"
        className="rounded"
      />

      {/* Blog Summary Section */}
      <section>
      <h2 className="text-xl xs:text-2xl md:text-3xl font-bold uppercase text-accentDarkPrimary">
        Summary
      </h2>
      <p className="mt-[10px] text-base md:text-xl leading-relaxed text-justify text-dark/80 dark:text-light/80">
       {post.summary}
      </p>
      </section>

      {/* Author Section (Image & Bio) */}
      <section className="mt-[10px] px-2 sm:px-8 md:px-12 flex gap-2 xs:gap-4 sm:gap-6 items-start xs:items-center justify-start">
        <Image
          src={urlFor(post.author.image)}
          width={200}
          height={200}
          alt="author"
          className="object-cover rounded-full h-12 w-12 sm:h-24 sm:w-24"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-dark dark:text-light">{post.author.name}</h3>
          <p className="italic text-xs xs:text-sm sm:text-base text-dark/80 dark:text-light/80">
           {post.author.bio}
          </p>
        </div>
      </section>

      {/* Main Body of Blog */}
      <section className="mt-[10px] text-lg leading-normal text-dark/80 dark:text-light/80
      
      ">
        {/* prose-h4:text-accentDarkPrimary prose-h4:text-3xl prose-h4:font-bold 
      prose-li:list-disc prose-li:list-inside prose-li:marker:text-accentDarkSecondary
      prose-strong:text-dark dark:prose-strong:text-white */}
      <PortableText
      value={post.content} 
       components={components}
      />
      </section>
    </article>
  );
}
