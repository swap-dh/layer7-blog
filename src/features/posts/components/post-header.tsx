import { PostFrontmatter } from '../types/post'

interface PostHeaderProps {
  frontmatter: PostFrontmatter
}

export function PostHeader({ frontmatter }: PostHeaderProps) {
  return (
    <header className="mb-8">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md dark:bg-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {frontmatter.title}
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {frontmatter.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <time dateTime={frontmatter.date}>
              {new Date(frontmatter.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            {frontmatter.updated && (
              <span>
                · 수정됨: {new Date(frontmatter.updated).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900 dark:text-blue-200">
              {frontmatter.category}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
