# check gem loaded
%w(rainbow).each{ |gem_name|
  begin
    require gem_name
  rescue LoadError
    puts "Ruby Gem: #{gem_name} is required"
    exit
  end
}

LIB_NAME = 'pklib.js'
LIB_NAME_MIN = 'pklib.min.js'
DIR_SRC = 'src/'
DIR_DOCS = 'docs/'
DIR_TOOLS_JS_DOC = 'tools/jsdoc-toolkit/'
DIT_TOOLS_COMPRESSOR = 'tools/yuicompressor/'

yuicompressor = "java -jar #{DIT_TOOLS_COMPRESSOR}/build/yuicompressor-2.4.7.jar #{LIB_NAME} -o #{LIB_NAME_MIN}"
jsdoc = "java -jar #{DIR_TOOLS_JS_DOC}jsrun.jar #{DIR_TOOLS_JS_DOC}app/run.js -d=#{DIR_DOCS} -a -t=#{DIR_TOOLS_JS_DOC}templates/jsdoc -p #{DIR_SRC} -q"

verbose(false)

# master library file
if File.exists?(LIB_NAME)
  File.delete(LIB_NAME)
end
File.new(LIB_NAME, File::CREAT|File::TRUNC|File::RDWR, 0777)

# minified library file
if File.exists?(LIB_NAME_MIN)
  File.delete(LIB_NAME_MIN)
end
File.new(LIB_NAME_MIN, File::CREAT|File::TRUNC|File::RDWR, 0777)

# dir with documentation
if File.directory?(DIR_DOCS)
  FileUtils.rm_r DIR_DOCS, :force => true
end
Dir.mkdir(DIR_DOCS)

def its_ok
  puts "\t\t\t\t\t" + '['.foreground(:cyan) + ' ok '.foreground(:green) + ']'.foreground(:cyan)
end

task :default

puts '-------------- pklib JavaScript library --------------'.foreground(:yellow)

print '*'.foreground(:green) + ' Build ...'

files = ["header.js", "ajax.js", "array.js", "aspect.js", "common.js", "cookie.js", \
 "css.js", "dom.js", "event.js", "file.js", "object.js", "profiler.js", "string.js", \
 "ui.js", "ui.glass.js", "ui.loader.js", "ui.message.js", "ui.size.js", "url.js", "utils.js"]

lib_data = File.read(LIB_NAME)

File.open(LIB_NAME, 'w') do |f|
  for file in files
    f.write File.read("#{DIR_SRC}#{file}")
    f.write lib_data
  end
end

its_ok()

print '*'.foreground(:green) + ' Minifing ...'

sh yuicompressor

lib_data = File.read(LIB_NAME_MIN)

File.open(LIB_NAME_MIN, 'w') do |f|
  f.write "/** pklib JavaScript library | http://pklib.com/licencja.html **/\n"
  f.write lib_data
end

its_ok()

print '*'.foreground(:green) + ' Documents ...'
sh jsdoc

its_ok()
