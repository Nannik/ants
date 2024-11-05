

import * as gfx from 'gophergfx'
import { AnimatedBone } from './AnimatedBone';
import { AnimatedCharacter } from './AnimatedCharacter'


/**
 * This character should draw each bone as a cylinder with radius 0.01.  Transformation matrices 
 * need to be used to scale, rotate, and translate the cylinder so that it starts at the origin
 * of bone space and extends in the bone's direction with a length equal to the bone's length.
 */
export class SkeletonCharacter extends AnimatedCharacter
{
	public MESH_RESOLUTION = 10;
	public CYLINDER_RADIUS = 0.01;

    constructor() {
        super();
    }

    public override addGeometryToAnimatedBone(bone: AnimatedBone): void
    {
        // PART 4: Create a skeleton.
        
        // Use a cylinder mesh as a starting point, then apply the correct transformations
        // to the cylinder's localToParentMatrix so that it starts at the origin of bone space 
        // and extends in the bone's direction with a length equal to the bone's length. 

		bone.add(this.createBoneMesh(bone));
    }

	protected createBoneMesh(bone: AnimatedBone) {
		const mesh = this.createCylinder();

		const matrix = gfx.Matrix4.multiply(
			gfx.Matrix4.makeAlign(new gfx.Vector3(0, 1, 0), bone.direction),
			gfx.Matrix4.makeScale(new gfx.Vector3(1, bone.length, 1))
		)

		mesh.setLocalToParentMatrix(matrix, false)

		return mesh;
	}

	protected createCylinder(): gfx.Mesh3 {
		const mesh = new gfx.Mesh3();

		const vert: gfx.Vector3[] = [];
		const normals: gfx.Vector3[] = [];
		const idx: number[] = [];

		for (let i = 0; i < this.MESH_RESOLUTION; i++) {
			const theta = (i / this.MESH_RESOLUTION) * Math.PI * 2;
			const x = this.CYLINDER_RADIUS * Math.cos(theta);
			const y = this.CYLINDER_RADIUS * Math.sin(theta);

			vert.push(
				new gfx.Vector3(x, 1, y),
				new gfx.Vector3(x, 0, y),
			);
			normals.push(
				new gfx.Vector3(x, 0, y),
				new gfx.Vector3(x, 0, y)
			)
		}

		for (let i = 0; i < this.MESH_RESOLUTION; i++) {
			for (let j = 0; j < 2; j++) {
				const tl = i * 2 + j;
				const tr = tl + 1;
				const bl = tl + 2;
				const br = bl + 1;

				idx.push(tl, bl, tr);
				idx.push(tr, bl, br);
			}
		}
		
		mesh.setVertices(vert)
		mesh.setIndices(idx)
		mesh.setNormals(normals)

		return mesh;
	}
}
